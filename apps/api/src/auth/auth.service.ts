import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordService } from '../password';
import { AccountService } from '../account/account.service';
import { ErrorCode } from '@repo/shared';

@Injectable()
export class AuthService {
    constructor(private readonly passwordService: PasswordService, private readonly accountService: AccountService) { }

    async validateUser(email: string, password: string) {
        const account = await this.accountService.findAccountByEmailWithPassword(email);

        if (!account) {
            throw new UnauthorizedException(ErrorCode.INVALID_CREDENTIALS);
        }

        const isPasswordValid = await this.passwordService.compare(password, account.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException(ErrorCode.INVALID_CREDENTIALS);
        }

        return account;
    }
}
