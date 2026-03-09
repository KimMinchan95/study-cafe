import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ErrorCode } from '@repo/shared';
import { WithCafeIdDto } from '../../common';

const SEAT_STATE_VALUES = ['IDLE', 'LOCKED', 'USING'] as const;

export class CreateSeatDto extends WithCafeIdDto {
    @ApiProperty({
        description: '좌석 명',
        example: '좌석 1',
    })
    @IsNotEmpty({ message: ErrorCode.THIS_FIELD_IS_REQUIRED })
    @IsString({ message: ErrorCode.MUST_BE_STRING })
    seatName: string;

    @ApiProperty({
        description: '좌석 상태 (IDLE | LOCKED | USING)',
        example: 'IDLE',
        enum: SEAT_STATE_VALUES,
    })
    @IsNotEmpty({ message: ErrorCode.THIS_FIELD_IS_REQUIRED })
    @IsIn(SEAT_STATE_VALUES, {
        message: `state는 ${SEAT_STATE_VALUES.join(', ')} 중 하나여야 합니다`,
    })
    state: (typeof SEAT_STATE_VALUES)[number];

    @ApiProperty({
        description: '좌석 위치',
        example: '1층 1번 좌석',
    })
    @IsNotEmpty({ message: ErrorCode.THIS_FIELD_IS_REQUIRED })
    @IsString({ message: ErrorCode.MUST_BE_STRING })
    location: string;

    @ApiProperty({
        description: '좌석 번호',
        example: 1,
    })
    @IsNotEmpty({ message: ErrorCode.THIS_FIELD_IS_REQUIRED })
    @IsNumber({}, { message: ErrorCode.MUST_BE_NUMBER })
    seatNumber: number;

    @ApiProperty({
        description: '좌석 유형',
        example: '일반 좌석',
    })
    @IsNotEmpty({ message: ErrorCode.THIS_FIELD_IS_REQUIRED })
    @IsString({ message: ErrorCode.MUST_BE_STRING })
    seatType: string;
}
