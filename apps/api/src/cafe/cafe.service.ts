import {
    BadRequestException,
    Injectable,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import type { CafeImages } from '@generated/prisma/client';
import { CreateCafeDto } from './dto/create-cafe.dto';
import { UpdateCafeDto } from './dto/update-cafe.dto';
import { PrismaConnector } from '../prisma';
import { ErrorCode } from '@repo/shared';
import { toCafeResponse } from './util';
import { saveCafeImage } from './util/cafe-image-storage.util';

@Injectable()
export class CafeService {
    constructor(private readonly prisma: PrismaConnector) {}

    async create(createCafeDto: CreateCafeDto) {
        const existing = await this.prisma.cafe.findUnique({
            where: { businessName: createCafeDto.businessName },
        });
        if (existing) {
            throw new ConflictException(ErrorCode.BUSINESS_NAME_ALREADY_EXISTS);
        }

        const cafe = await this.prisma.cafe.create({
            data: {
                businessName: createCafeDto.businessName,
                address1: createCafeDto.address1,
                address2: createCafeDto.address2,
            },
        });

        const files = createCafeDto.images ?? [];
        const createdImages: CafeImages[] = [];

        if (files.length > 0) {
            for (const file of files) {
                if (!file.buffer) {
                    throw new BadRequestException(
                        '이미지 파일이 비어 있습니다. form-data 필드 이름이 "images"인지, 파일이 첨부되었는지 확인하세요.',
                    );
                }
                const meta = saveCafeImage(cafe.cafeId, file);
                const imageRecord = await this.prisma.cafeImages.create({
                    data: {
                        cafeId: cafe.cafeId,
                        imgSrc: meta.imgSrc,
                        originName: meta.originName,
                        identifiedName: meta.identifiedName,
                        extensions: meta.extensions,
                    },
                });
                createdImages.push(imageRecord);
            }
        }

        return toCafeResponse({
            ...cafe,
            images: createdImages,
        });
    }

    async findAll() {
        const cafes = await this.prisma.cafe.findMany({
            orderBy: { createdAt: 'desc' },
            include: { images: true },
        });
        return cafes.map(toCafeResponse);
    }

    async findOne(cafeId: bigint) {
        const cafe = await this.prisma.cafe.findUnique({
            where: { cafeId },
            include: { images: true },
        });
        if (!cafe) {
            throw new NotFoundException(ErrorCode.CAFE_NOT_FOUND);
        }
        return toCafeResponse(cafe);
    }

    async update(cafeId: bigint, updateCafeDto: UpdateCafeDto) {
        const existing = await this.prisma.cafe.findUnique({
            where: { cafeId },
        });
        if (!existing) {
            throw new NotFoundException(ErrorCode.CAFE_NOT_FOUND);
        }

        if (updateCafeDto.businessName !== undefined) {
            const duplicate = await this.prisma.cafe.findFirst({
                where: {
                    businessName: updateCafeDto.businessName,
                    cafeId: { not: cafeId },
                },
            });
            if (duplicate) {
                throw new ConflictException(
                    ErrorCode.BUSINESS_NAME_ALREADY_EXISTS
                );
            }
        }

        const cafe = await this.prisma.cafe.update({
            where: { cafeId },
            data: {
                ...(updateCafeDto.businessName !== undefined && {
                    businessName: updateCafeDto.businessName,
                }),
                ...(updateCafeDto.address1 !== undefined && {
                    address1: updateCafeDto.address1,
                }),
                ...(updateCafeDto.address2 !== undefined && {
                    address2: updateCafeDto.address2,
                }),
            },
            include: { images: true },
        });
        return toCafeResponse(cafe);
    }

    async remove(cafeId: bigint) {
        const existing = await this.prisma.cafe.findUnique({
            where: { cafeId },
        });
        if (!existing) {
            throw new NotFoundException(ErrorCode.CAFE_NOT_FOUND);
        }

        const cafe = await this.prisma.cafe.delete({
            where: { cafeId },
            include: { images: true },
        });
        return toCafeResponse(cafe);
    }
}
