import type { Prices, Cafe } from '@generated/prisma/client';

export type PriceResponse = Omit<Prices, 'priceId' | 'cafeId'> & {
    priceId: string;
    cafeId: string;
};

export type PriceWithCafeResponse = PriceResponse & {
    cafe?: Omit<Cafe, 'cafeId'> & { cafeId: string };
};

function toPriceResponse(
    price: Prices & { cafe?: Cafe }
): PriceWithCafeResponse {
    const response: PriceWithCafeResponse = {
        priceId: String(price.priceId),
        cafeId: String(price.cafeId),
        amountSubtotal: price.amountSubtotal,
        amountTax: price.amountTax,
        amountTotal: price.amountTotal,
        duration: price.duration,
    };
    return response;
}

export { toPriceResponse };
