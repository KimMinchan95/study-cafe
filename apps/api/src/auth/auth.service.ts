import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordService } from '../password';
import { AccountService } from '../account/account.service';
import { ErrorCode } from '@repo/shared';

@Injectable()
export class AuthService {
    constructor(private readonly passwordService: PasswordService, private readonly accountService: AccountService) { }

    async validateUser(email: string, password: string) {
        const user = await this.accountService.findAccountByEmailWithPassword(email);

        if (!user) {
            throw new UnauthorizedException(ErrorCode.INVALID_CREDENTIALS);
        }

        const isPasswordValid = await this.passwordService.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException(ErrorCode.INVALID_CREDENTIALS);
        }

        return user;
    }
}
