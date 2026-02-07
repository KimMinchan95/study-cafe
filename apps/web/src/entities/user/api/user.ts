import { fetchApi } from '@/shared/lib/api';
import type { Account, BaseAccountFields } from '@repo/shared';

export async function getUser(): Promise<Account | null> {
    return fetchApi<Account | null>('/auth/me');
}

export type CreateAccountDto = BaseAccountFields;

export async function createAccount(
    createAccountDto: CreateAccountDto
): Promise<Account> {
    return fetchApi<Account>('/accounts', {
        method: 'POST',
        body: JSON.stringify(createAccountDto),
    });
}
