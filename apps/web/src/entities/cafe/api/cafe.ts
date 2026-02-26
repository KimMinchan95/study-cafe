import { fetchApi } from '@/shared/lib/api';
import type { Cafe } from '@repo/shared';

export async function getCafeList(): Promise<Cafe[]> {
    return fetchApi<Cafe[]>('/cafe');
}
