import type { Cafe, CafeBadges, CafeImages } from '@generated/prisma/client';

type CafeImageResponse = Omit<CafeImages, 'imageId' | 'cafeId'> & {
    imageId: string;
};

export type CafeBadgeResponse = Pick<CafeBadges, 'title' | 'bgColor' | 'txtColor'> & {
    badgeId: string;
};

export type CafeResponse = Omit<Cafe, 'cafeId'> & {
    cafeId: string;
    images?: CafeImageResponse[];
    badges?: CafeBadgeResponse[];
};

function toCafeImageResponse(image: CafeImages): CafeImageResponse {
    return {
        imageId: String(image.imageId),
        imgSrc: image.imgSrc,
        originName: image.originName,
        identifiedName: image.identifiedName,
        extensions: image.extensions,
    };
}

function toCafeBadgeResponse(badge: CafeBadges): CafeBadgeResponse {
    return {
        badgeId: String(badge.badgeId),
        title: badge.title,
        bgColor: badge.bgColor,
        txtColor: badge.txtColor,
    };
}

export function toCafeResponse(
    cafe: Cafe & { images?: CafeImages[]; badges?: CafeBadges[] },
): CafeResponse {
    const { cafeId, images, badges, ...rest } = cafe;
    const base: CafeResponse = {
        cafeId: String(cafeId),
        ...rest,
        images: (images ?? []).map(toCafeImageResponse),
        badges: (badges ?? []).map(toCafeBadgeResponse),
    };
    return base;
}
