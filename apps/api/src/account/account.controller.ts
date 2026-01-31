import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  findAll() {
    return this.accountService.findAll();
  }

  @Get(':accountId')
  findOneById(@Param('accountId') accountId: string) {
    return this.accountService.findOne(BigInt(accountId));
  }

  @Patch(':accountId')
  update(@Param('accountId') accountId: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(BigInt(accountId), updateAccountDto);
  }

  @Delete(':accountId')
  remove(@Param('accountId') accountId: string) {
    return this.accountService.remove(BigInt(accountId));
  }
}
