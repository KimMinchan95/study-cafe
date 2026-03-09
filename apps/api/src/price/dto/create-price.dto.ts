import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ErrorCode } from '@repo/shared';
import { WithCafeIdDto } from '../../common';

export class CreatePriceDto extends WithCafeIdDto {
    @ApiProperty({
        example: 10000,
        description: '세전 단가',
    })
    @IsNotEmpty({ message: ErrorCode.THIS_FIELD_IS_REQUIRED })
    @IsNumber({}, { message: ErrorCode.MUST_BE_NUMBER })
    amountSubtotal: number;

    @ApiProperty({
        description: '세금',
        example: 1000,
    })
    @IsNotEmpty({ message: ErrorCode.THIS_FIELD_IS_REQUIRED })
    @IsNumber({}, { message: ErrorCode.MUST_BE_NUMBER })
    amountTax: number;

    @ApiProperty({
        description: '총액',
        example: 10000,
    })
    @IsNotEmpty({ message: ErrorCode.THIS_FIELD_IS_REQUIRED })
    @IsNumber({}, { message: ErrorCode.MUST_BE_NUMBER })
    amountTotal: number;

    @ApiProperty({
        description: '이용시간',
        example: 1,
    })
    @IsNotEmpty({ message: ErrorCode.THIS_FIELD_IS_REQUIRED })
    @IsNumber({}, { message: ErrorCode.MUST_BE_NUMBER })
    duration: number;
}
