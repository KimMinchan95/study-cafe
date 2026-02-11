import type { Account } from '@generated/prisma/client';

type AccountResponse = Omit<Account, 'password' | 'accountId'> & {
    accountId: string;
};

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
