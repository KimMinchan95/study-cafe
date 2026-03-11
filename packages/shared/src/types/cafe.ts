interface CafeImage {
    imageId: string;
    imgSrc: string;
    originName: string;
    identifiedName: string;
    extensions: string;
}

export interface CafeBadge {
    badgeId: string;
    title: string;
    bgColor: string;
    txtColor: string;
}

export interface Price {
    priceId: string;
    cafeId: string;
    amountSubtotal: number;
    amountTax: number;
    amountTotal: number;
    duration: number;
}

type SeatState = 'IDLE' | 'LOCKED' | 'USING';

export interface Seat {
    cafeId: string;
    location: string;
    seatId: string;
    seatName: string;
    seatNumber: number;
    seatType: string;
    state: SeatState;
}

export interface Cafe {
    seats: Seat[];
    prices: Price[];
    address1: string;
    address2: string;
    businessName: string;
    cafeId: string;
    images: CafeImage[];
    badges?: CafeBadge[];
    createdAt: Date;
    updatedAt: Date | null;
}
