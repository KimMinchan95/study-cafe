import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { PrismaConnector } from '../prisma';
import { ErrorCode } from '@repo/shared';
import { toPriceResponse } from './util/price-response.util';

@Injectable()
export class PriceService {
    constructor(private readonly prisma: PrismaConnector) {}

    async create(createPriceDto: CreatePriceDto) {
        const cafeId = BigInt(createPriceDto.cafeId);
        const cafe = await this.prisma.cafe.findUnique({
            where: { cafeId },
        });
        if (!cafe) {
            throw new NotFoundException(ErrorCode.CAFE_NOT_FOUND);
        }

        const price = await this.prisma.prices.create({
            data: {
                cafeId,
                amountSubtotal: createPriceDto.amountSubtotal,
                amountTax: createPriceDto.amountTax,
                amountTotal: createPriceDto.amountTotal,
                duration: createPriceDto.duration,
            },
        });
        return toPriceResponse(price);
    }

    async findAll() {
        const prices = await this.prisma.prices.findMany({
            orderBy: { priceId: 'desc' },
            include: { cafe: true },
        });
        return prices.map(toPriceResponse);
    }

    async findOneByCafeId(cafeId: bigint) {
        const price = await this.prisma.prices.findFirst({
            where: { cafeId },
            orderBy: { priceId: 'asc' },
            include: { cafe: true },
        });
        if (!price) {
            throw new NotFoundException(ErrorCode.PRICE_NOT_FOUND);
        }
        return toPriceResponse(price);
    }

    async findOne(priceId: bigint) {
        const price = await this.prisma.prices.findUnique({
            where: { priceId },
            include: { cafe: true },
        });
        if (!price) {
            throw new NotFoundException(ErrorCode.PRICE_NOT_FOUND);
        }
        return toPriceResponse(price);
    }

    async update(priceId: bigint, updatePriceDto: UpdatePriceDto) {
        const existing = await this.prisma.prices.findUnique({
            where: { priceId },
        });
        if (!existing) {
            throw new NotFoundException(ErrorCode.PRICE_NOT_FOUND);
        }
        const price = await this.prisma.prices.update({
            where: { priceId },
            data: {
                amountSubtotal: updatePriceDto.amountSubtotal,
                amountTax: updatePriceDto.amountTax,
                amountTotal: updatePriceDto.amountTotal,
                duration: updatePriceDto.duration,
            },
            include: { cafe: true },
        });
        return toPriceResponse(price);
    }

    async remove(priceId: bigint) {
        const existing = await this.prisma.prices.findUnique({
            where: { priceId },
        });
        if (!existing) {
            throw new NotFoundException(ErrorCode.PRICE_NOT_FOUND);
        }
        const price = await this.prisma.prices.delete({
            where: { priceId },
            include: { cafe: true },
        });
        return toPriceResponse(price);
    }
}
