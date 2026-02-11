import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { ErrorCode } from '@repo/shared';

import type { Account } from '@generated/prisma/client';

interface RequestWithAccount extends Request {
    account: Account;
}

const ACCOUNT_ID_PARAM = 'accountId';

@Injectable()
export class OwnerGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<RequestWithAccount>();
        const account = request.account;
        const raw = request.params[ACCOUNT_ID_PARAM];
        const resourceId = Array.isArray(raw) ? raw[0] : raw;

        if (!account || !resourceId) {
            throw new ForbiddenException(ErrorCode.FORBIDDEN);
        }

        const userAccountId = account.accountId;
        const resourceAccountId = BigInt(resourceId);

        if (userAccountId !== resourceAccountId) {
            throw new ForbiddenException(ErrorCode.FORBIDDEN);
        }

        return true;
    }
}
