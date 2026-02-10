import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { toAccountResponse } from '../account/util';
import { SessionGuard } from './guards/session.guard';

import type { Account } from '../../generated/prisma/client';

interface RequestWithAccount extends Request {
    user: Account;
    account?: Account;
    login: (account: Account, callback: (err?: Error) => void) => void;
    logout: (callback: (err?: Error) => void) => void;
    session: { destroy: (callback: (err?: Error) => void) => void };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Body() _body: LoginDto, @Request() req: RequestWithAccount) {
        const account = req.user;
        await new Promise<void>((resolve, reject) => {
            req.login(account, (err) => (err ? reject(err) : resolve()));
        });
        return toAccountResponse(account);
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
                err
                    ? reject(
                          err instanceof Error ? err : new Error(String(err))
                      )
                    : resolve()
            );
        });
    }
}
