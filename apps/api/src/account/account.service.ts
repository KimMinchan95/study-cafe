import { Injectable, ConflictException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaConnector } from '../prisma';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaConnector) { }

  async create(createAccountDto: CreateAccountDto) {
    const existingAccount = await this.prisma.account.findUnique({
      where: { email: createAccountDto.email },
    });

    if (existingAccount) {
      throw new ConflictException('EMAIL_ALREADY_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(createAccountDto.password, 10);

    const account = await this.prisma.account.create({
      data: {
        email: createAccountDto.email,
        password: hashedPassword,
        name: createAccountDto.name,
        displayName: createAccountDto.displayName,
      },
    });

    const { password: _password, ...result } = account;
    return result;
  }

  findAll() {
    return this.prisma.account.findMany();
  }

  findOne(accountId: bigint) {
    return this.prisma.account.findUnique({
      where: { accountId },
    });
  }

  update(accountId: bigint, updateAccountDto: UpdateAccountDto) {
    return this.prisma.account.update({
      where: { accountId },
      data: updateAccountDto,
    });
  }

  remove(accountId: bigint) {
    return this.prisma.account.delete({
      where: { accountId },
    });
  }
}
