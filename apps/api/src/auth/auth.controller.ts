import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { toAccountResponse } from '../account/util';

import type { Account } from '  ../../generated/prisma/client';

interface RequestWithAccount extends Request {
  account: Account;
  login: (account: Account, callback: (err?: Error) => void) => void;
}

@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() _body: LoginDto, @Request() req: RequestWithAccount) {
    await new Promise<void>((resolve, reject) => {
      req.login(req.account, (err) => (err ? reject(err) : resolve()));
    });
    return toAccountResponse(req.account);
  }
}
