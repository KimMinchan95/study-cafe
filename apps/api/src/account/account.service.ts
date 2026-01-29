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

    const { password, ...result } = account;
    return result;
  }

  findAll() {
    return `This action returns all account`;
  }

  findOne(accountId: BigInt) {
    return `This action returns a #${accountId} account`;
  }

  update(accountId: BigInt, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${accountId} account`;
  }

  remove(accountId: BigInt) {
    return `This action removes a #${accountId} account`;
  }
}
