import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { SessionGuard } from '../auth/guards/session.guard';
import { OwnerGuard } from '../auth/guards/owner.guard';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @UseGuards(SessionGuard)
  @Get()
  findAll() {
    return this.accountService.findAll();
  }

  @UseGuards(SessionGuard)
  @Get(':accountId')
  findOneById(@Param('accountId') accountId: string) {
    return this.accountService.findOne(BigInt(accountId));
  }

  @UseGuards(SessionGuard, OwnerGuard)
  @Patch(':accountId')
  update(
    @Param('accountId') accountId: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountService.update(BigInt(accountId), updateAccountDto);
  }

  @UseGuards(SessionGuard, OwnerGuard)
  @Delete(':accountId')
  remove(@Param('accountId') accountId: string) {
    return this.accountService.remove(BigInt(accountId));
  }
}
