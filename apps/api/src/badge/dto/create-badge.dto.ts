import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import { ErrorCode } from '@repo/shared';
import { WithCafeIdDto } from '../../common';

export class CreateBadgeDto extends WithCafeIdDto {
    @ApiProperty({
        description: '뱃지 제목',
        example: '무료 와이파이',
    })
    @IsNotEmpty({ message: ErrorCode.THIS_FIELD_IS_REQUIRED })
    @IsString({ message: ErrorCode.MUST_BE_STRING })
    @MinLength(1, { message: ErrorCode.MUST_BE_AT_LEAST_1_CHARACTERS })
    @MaxLength(255, { message: ErrorCode.MUST_BE_AT_MOST_255_CHARACTERS })
    title: string;

    @ApiPropertyOptional({
        description: '배경 색상 (hex)',
        example: '#ffffff',
        default: '#ffffff',
    })
    @IsOptional()
    @IsString({ message: ErrorCode.MUST_BE_STRING })
    @MaxLength(10)
    bgColor?: string;

    @ApiPropertyOptional({
        description: '글자 색상 (hex)',
        example: '#000000',
        default: '#000000',
    })
    @IsOptional()
    @IsString({ message: ErrorCode.MUST_BE_STRING })
    @MaxLength(10)
    txtColor?: string;
}
