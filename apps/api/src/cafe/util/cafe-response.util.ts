import type { Cafe, CafeImages } from '@generated/prisma/client';

type CafeImageResponse = Omit<CafeImages, 'imageId' | 'cafeId'> & {
    imageId: string;
};

export type CafeResponse = Omit<Cafe, 'cafeId'> & {
    cafeId: string;
    images?: CafeImageResponse[];
};

function toCafeImageResponse(image: CafeImages): CafeImageResponse {
    const { imageId, cafeId: _cafeId, ...rest } = image;
    return { imageId: String(imageId), ...rest };
}

export function toCafeResponse(
    cafe: Cafe & { images?: CafeImages[] },
): CafeResponse {
    const { cafeId, images, ...rest } = cafe;
    const base: CafeResponse = {
        cafeId: String(cafeId),
        ...rest,
        images: (images ?? []).map(toCafeImageResponse),
    };
    return base;
}
