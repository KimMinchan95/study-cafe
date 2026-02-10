import type { Cafe } from '../../../generated/prisma/client';

type CafeResponse = Omit<Cafe, 'cafeId'> & {
    cafeId: string;
};

export function toCafeResponse(cafe: Cafe): CafeResponse {
    const { cafeId, ...rest } = cafe;
    return { cafeId: String(cafeId), ...rest } as CafeResponse;
}
