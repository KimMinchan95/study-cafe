import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { toAccountResponse } from '../account/util';
import { SessionGuard } from './guards/session.guard';

import type { Account } from '../../generated/prisma/client';

interface RequestWithAccount extends Request {
  account: Account;
  user: Account;
  login: (account: Account, callback: (err?: Error) => void) => void;
  logout: (callback: (err?: Error) => void) => void;
  session: { destroy: (callback: (err?: Error) => void) => void };
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

  @UseGuards(SessionGuard)
  @Get('me')
  me(@Request() req: RequestWithAccount) {
    return toAccountResponse(req.user);
  }

  @Post('logout')
  async logout(@Request() req: RequestWithAccount) {
    await new Promise<void>((resolve, reject) => {
      req.logout((err) => (err ? reject(err) : resolve()));
    });
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) =>
        err ? reject(err instanceof Error ? err : new Error(String(err))) : resolve(),
      );
    });
  }
}
