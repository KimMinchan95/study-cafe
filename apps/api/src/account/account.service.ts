import { Injectable, ConflictException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaConnector } from '../prisma';
import { PasswordService } from '../password';
import { ErrorCode } from '@repo/shared';
import { toAccountResponse, toAccountResponseWithPassword } from './util';

@Injectable()
export class AccountService {
    constructor(
        private readonly prisma: PrismaConnector,
        private readonly passwordService: PasswordService
    ) {}

    async create(createAccountDto: CreateAccountDto) {
        const existingAccount = await this.prisma.account.findUnique({
            where: { email: createAccountDto.email },
        });

        if (existingAccount) {
            throw new ConflictException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        const hashedPassword = await this.passwordService.hash(
            createAccountDto.password
        );

        const account = await this.prisma.account.create({
            data: {
                email: createAccountDto.email,
                password: hashedPassword,
                name: createAccountDto.name,
                displayName: createAccountDto.displayName,
            },
        });

        return toAccountResponse(account);
    }

    async findAll() {
        const accounts = await this.prisma.account.findMany();
        return accounts.map(toAccountResponse);
    }

    async findOne(accountId: bigint) {
        const account = await this.prisma.account.findUnique({
            where: { accountId },
        });
        if (!account) {
            return null;
        }
        return toAccountResponse(account);
    }

    async findOneByEmail(email: string) {
        const account = await this.prisma.account.findUnique({
            where: { email },
        });
        if (!account) {
            return null;
        }
        return toAccountResponse(account);
    }

    async findAccountByEmailWithPassword(email: string) {
        const account = await this.prisma.account.findUnique({
            where: { email },
        });
        if (!account) {
            return null;
        }
        return toAccountResponseWithPassword(account);
    }

    async update(accountId: bigint, updateAccountDto: UpdateAccountDto) {
        const account = await this.prisma.account.update({
            where: { accountId },
            data: updateAccountDto,
        });
        return toAccountResponse(account);
    }

    async remove(accountId: bigint) {
        const account = await this.prisma.account.delete({
            where: { accountId },
        });
        return toAccountResponse(account);
    }
}
