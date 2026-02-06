import { fetchApi } from '@/shared/lib/api';
import type { Account } from '@repo/shared';

export async function login(email: string, password: string): Promise<Account> {
    return fetchApi<Account>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

export async function logout(): Promise<void> {
    return fetchApi<void>('/auth/logout', {
        method: 'POST',
    });
}
