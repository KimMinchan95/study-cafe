import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
  create(createAccountDto: CreateAccountDto) {
    return 'This action adds a new account';
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
