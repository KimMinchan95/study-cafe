import type { Seats, Cafe } from '@generated/prisma/client';

export type SeatResponse = Omit<Seats, 'seatId' | 'cafeId'> & {
    seatId: string;
    cafeId: string;
};

export type SeatWithCafeResponse = SeatResponse & {
    cafe?: Omit<Cafe, 'cafeId'> & { cafeId: string };
};

function toSeatResponse(seat: Seats & { cafe?: Cafe }): SeatWithCafeResponse {
    const response: SeatWithCafeResponse = {
        seatId: String(seat.seatId),
        cafeId: String(seat.cafeId),
        seatName: seat.seatName,
        state: seat.state,
        location: seat.location,
        seatNumber: seat.seatNumber,
        seatType: seat.seatType,
    };
    return response;
}

export { toSeatResponse };
