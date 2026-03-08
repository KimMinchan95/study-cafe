import type { Cafe, CafeBadges } from '@generated/prisma/client';

export type BadgeResponse = Omit<CafeBadges, 'badgeId' | 'cafeId'> & {
    badgeId: string;
    cafeId: string;
};

export type BadgeWithCafeResponse = BadgeResponse & {
    cafe?: Omit<Cafe, 'cafeId'> & { cafeId: string };
};

function toBadgeResponse(badge: CafeBadges & { cafe?: Cafe }): BadgeWithCafeResponse {
    const response: BadgeWithCafeResponse = {
        badgeId: String(badge.badgeId),
        cafeId: String(badge.cafeId),
        title: badge.title,
        bgColor: badge.bgColor,
        txtColor: badge.txtColor,
    };
    if (badge.cafe) {
        const cafe = badge.cafe;
        response.cafe = {
            cafeId: String(cafe.cafeId),
            businessName: cafe.businessName,
            address1: cafe.address1,
            address2: cafe.address2,
            createdAt: cafe.createdAt,
            updatedAt: cafe.updatedAt ?? null,
        };
    }
    return response;
}

export { toBadgeResponse };
