import { fetchApi } from '@/shared/lib/api';
import type { Account } from '@repo/shared';

export async function getUser(): Promise<Account | null> {
    return fetchApi<Account | null>('/auth/me');
}
