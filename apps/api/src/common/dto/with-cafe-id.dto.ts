import { ApiProperty } from '@nestjs/swagger';
import * as classTransformer from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ErrorCode } from '@repo/shared';

export class WithCafeIdDto {
    @ApiProperty({
        description: '카페 ID (문자열 또는 숫자)',
        example: 13,
    })
    @IsNotEmpty({ message: ErrorCode.THIS_FIELD_IS_REQUIRED })
    @classTransformer.Transform(({ value }: { value: unknown }) =>
        typeof value === 'number' ? String(value) : value
    )
    @IsString({ message: ErrorCode.MUST_BE_STRING })
    cafeId: string;
}
