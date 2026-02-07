import { fetchApi } from '@/shared/lib/api';

export async function logout(): Promise<void> {
    return fetchApi<void>('/auth/logout', {
        method: 'POST',
    });
}
