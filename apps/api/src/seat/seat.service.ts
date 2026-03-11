import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { PrismaConnector } from '../prisma';
import { ErrorCode } from '@repo/shared';
import { toSeatResponse } from './util/seat-response.util';

@Injectable()
export class SeatService {
    constructor(private readonly prisma: PrismaConnector) {}

    async create(createSeatDto: CreateSeatDto) {
        const cafeId = BigInt(createSeatDto.cafeId);
        const cafe = await this.prisma.cafe.findUnique({
            where: { cafeId },
        });
        if (!cafe) {
            throw new NotFoundException(ErrorCode.CAFE_NOT_FOUND);
        }

        const seat = await this.prisma.seats.create({
            data: {
                cafeId,
                seatName: createSeatDto.seatName,
                state: createSeatDto.state,
                location: createSeatDto.location,
                seatNumber: createSeatDto.seatNumber,
                seatType: createSeatDto.seatType,
            },
            include: { cafe: true },
        });
        return toSeatResponse(seat);
    }

    async findAll() {
        const seats = await this.prisma.seats.findMany({
            orderBy: { seatId: 'desc' },
            include: { cafe: true },
        });
        return seats.map(toSeatResponse);
    }

    async findManyByCafeId(cafeId: bigint) {
        const seats = await this.prisma.seats.findMany({
            where: { cafeId },
            orderBy: { seatNumber: 'asc' },
            include: { cafe: true },
        });
        return seats.map(toSeatResponse);
    }

    async findOne(seatId: bigint) {
        const seat = await this.prisma.seats.findUnique({
            where: { seatId },
            include: { cafe: true },
        });
        if (!seat) {
            throw new NotFoundException(ErrorCode.SEAT_NOT_FOUND);
        }
        return toSeatResponse(seat);
    }

    async update(seatId: bigint, updateSeatDto: UpdateSeatDto) {
        const existing = await this.prisma.seats.findUnique({
            where: { seatId },
        });
        if (!existing) {
            throw new NotFoundException(ErrorCode.SEAT_NOT_FOUND);
        }
        const seat = await this.prisma.seats.update({
            where: { seatId },
            data: {
                seatName: updateSeatDto.seatName,
                state: updateSeatDto.state,
                location: updateSeatDto.location,
                seatNumber: updateSeatDto.seatNumber,
                seatType: updateSeatDto.seatType,
            },
            include: { cafe: true },
        });
        return toSeatResponse(seat);
    }

    async remove(seatId: bigint) {
        const existing = await this.prisma.seats.findUnique({
            where: { seatId },
        });
        if (!existing) {
            throw new NotFoundException(ErrorCode.SEAT_NOT_FOUND);
        }
        const seat = await this.prisma.seats.delete({
            where: { seatId },
            include: { cafe: true },
        });
        return toSeatResponse(seat);
    }
}
