import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { toAccountResponse, toJsonSafeResponse } from '../account/util';
import { SessionGuard } from './guards/session.guard';

import type { Account } from '../../generated/prisma/client';

interface RequestWithAccount extends Request {
  user: Account;
  account?: Account;
  login: (account: Account, callback: (err?: Error) => void) => void;
  logout: (callback: (err?: Error) => void) => void;
  session: { destroy: (callback: (err?: Error) => void) => void };
}

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() _body: LoginDto, @Request() req: RequestWithAccount) {
    const account = req.user;
    try {
      await new Promise<void>((resolve, reject) => {
        req.login(account, (err) => (err ? reject(err) : resolve()));
      });
      return toJsonSafeResponse(toAccountResponse(account));
    } catch (err) {
      this.logger.error('Login failed', err instanceof Error ? err.stack : err);
      throw err;
    }
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
