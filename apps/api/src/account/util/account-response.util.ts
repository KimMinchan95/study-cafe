import type { Account } from '../../../generated/prisma/client';
import type { Account as AccountResponse } from '@repo/shared';

type AccountResponseWithPassword = Omit<Account, 'accountId'> & {
    accountId: string;
};

export function toAccountResponse(account: Account): AccountResponse {
    const { password: _password, accountId, ...rest } = account;
    return { accountId: String(accountId), ...rest } as AccountResponse;
}

export function toAccountResponseWithPassword(
    account: Account
): AccountResponseWithPassword {
    const { accountId, ...rest } = account;
    return {
        accountId: String(accountId),
        ...rest,
    } as AccountResponseWithPassword;
}

export function toJsonSafeResponse<T>(obj: T): T {
    return JSON.parse(
        JSON.stringify(obj, (_key, value) =>
            typeof value === 'bigint' ? String(value) : value
        )
    ) as T;
}
