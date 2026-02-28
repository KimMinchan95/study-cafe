import { fetchApi } from '@/shared/lib/api';
import type { Cafe } from '@repo/shared';

export async function getCafeList(): Promise<Cafe[]> {
    return fetchApi<Cafe[]>('/cafe');
}

export async function getCafeById(cafeId: string): Promise<Cafe> {
    return fetchApi<Cafe>(`/cafe/${cafeId}`);
}
