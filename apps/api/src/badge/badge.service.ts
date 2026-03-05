import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { PrismaConnector } from '../prisma';
import { ErrorCode } from '@repo/shared';

@Injectable()
export class BadgeService {
    constructor(private readonly prisma: PrismaConnector) {}

    async create(createBadgeDto: CreateBadgeDto) {
        const cafeId = BigInt(createBadgeDto.cafeId);
        const cafe = await this.prisma.cafe.findUnique({
            where: { cafeId },
        });
        if (!cafe) {
            throw new NotFoundException(ErrorCode.CAFE_NOT_FOUND);
        }

        return this.prisma.cafeBadges.create({
            data: {
                cafeId,
                title: createBadgeDto.title,
                bgColor: createBadgeDto.bgColor ?? '#ffffff',
                txtColor: createBadgeDto.txtColor ?? '#000000',
            },
        });
    }

    async findAll() {
        return this.prisma.cafeBadges.findMany({
            orderBy: { badgeId: 'desc' },
            include: { cafe: true },
        });
    }

    async findOne(badgeId: bigint) {
        const badge = await this.prisma.cafeBadges.findUnique({
            where: { badgeId },
            include: { cafe: true },
        });
        if (!badge) {
            throw new NotFoundException(ErrorCode.BADGE_NOT_FOUND);
        }
        return badge;
    }

    async update(badgeId: bigint, updateBadgeDto: UpdateBadgeDto) {
        const existing = await this.prisma.cafeBadges.findUnique({
            where: { badgeId },
        });
        if (!existing) {
            throw new NotFoundException(ErrorCode.BADGE_NOT_FOUND);
        }

        return this.prisma.cafeBadges.update({
            where: { badgeId },
            data: {
                ...(updateBadgeDto.cafeId !== undefined && {
                    cafeId: BigInt(updateBadgeDto.cafeId),
                }),
                ...(updateBadgeDto.title !== undefined && {
                    title: updateBadgeDto.title,
                }),
                ...(updateBadgeDto.bgColor !== undefined && {
                    bgColor: updateBadgeDto.bgColor,
                }),
                ...(updateBadgeDto.txtColor !== undefined && {
                    txtColor: updateBadgeDto.txtColor,
                }),
            },
            include: { cafe: true },
        });
    }

    async remove(badgeId: bigint) {
        const existing = await this.prisma.cafeBadges.findUnique({
            where: { badgeId },
        });
        if (!existing) {
            throw new NotFoundException(ErrorCode.BADGE_NOT_FOUND);
        }

        return this.prisma.cafeBadges.delete({
            where: { badgeId },
            include: { cafe: true },
        });
    }
}
