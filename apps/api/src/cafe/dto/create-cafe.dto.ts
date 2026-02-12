import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ErrorCode } from '@repo/shared';

export class CreateCafeDto {
    @ApiProperty({
        description: 'The business name of the cafe',
        example: 'Cafe Name',
    })
    @IsNotEmpty({ message: ErrorCode.THIS_FIELD_IS_REQUIRED })
    @IsString({ message: ErrorCode.MUST_BE_STRING })
    @MinLength(1, { message: ErrorCode.MUST_BE_AT_LEAST_1_CHARACTERS })
    @MaxLength(255, { message: ErrorCode.MUST_BE_AT_MOST_255_CHARACTERS })
    businessName: string;

    @ApiProperty({
        description: 'The address1 of the cafe',
        example: '서울특별시 강남구 삼성동',
    })
    @IsNotEmpty({ message: ErrorCode.THIS_FIELD_IS_REQUIRED })
    @IsString({ message: ErrorCode.MUST_BE_STRING })
    @MinLength(1, { message: ErrorCode.MUST_BE_AT_LEAST_1_CHARACTERS })
    @MaxLength(255, { message: ErrorCode.MUST_BE_AT_MOST_255_CHARACTERS })
    address1: string;

    @ApiProperty({
        description: 'The address2 of the cafe',
        example: '삼성로 123-45 2층',
    })
    @IsNotEmpty({ message: ErrorCode.THIS_FIELD_IS_REQUIRED })
    @IsString({ message: ErrorCode.MUST_BE_STRING })
    @MinLength(1, { message: ErrorCode.MUST_BE_AT_LEAST_1_CHARACTERS })
    @MaxLength(255, { message: ErrorCode.MUST_BE_AT_MOST_255_CHARACTERS })
    address2: string;

    @ApiPropertyOptional({
        description: 'The images of the cafe (multipart/form-data)',
        example: [],
    })
    @IsOptional()
    @IsArray()
    images?: Express.Multer.File[];
}
