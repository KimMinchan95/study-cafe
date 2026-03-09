import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { SeatService } from './seat.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';

@Controller('seat')
export class SeatController {
    constructor(private readonly seatService: SeatService) {}

    @Post()
    create(@Body() createSeatDto: CreateSeatDto) {
        return this.seatService.create(createSeatDto);
    }

    @Get()
    findAll() {
        return this.seatService.findAll();
    }

    @Get('cafe/:cafeId')
    findManyByCafeId(@Param('cafeId') cafeId: string) {
        return this.seatService.findManyByCafeId(BigInt(cafeId));
    }

    @Get(':seatId')
    findOne(@Param('seatId') seatId: string) {
        return this.seatService.findOne(BigInt(seatId));
    }

    @Patch(':seatId')
    update(
        @Param('seatId') seatId: string,
        @Body() updateSeatDto: UpdateSeatDto
    ) {
        return this.seatService.update(BigInt(seatId), updateSeatDto);
    }

    @Delete(':seatId')
    remove(@Param('seatId') seatId: string) {
        return this.seatService.remove(BigInt(seatId));
    }
}
