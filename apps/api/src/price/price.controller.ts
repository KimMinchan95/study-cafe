import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { PriceService } from './price.service';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';

@Controller('price')
export class PriceController {
    constructor(private readonly priceService: PriceService) {}

    @Post()
    create(@Body() createPriceDto: CreatePriceDto) {
        return this.priceService.create(createPriceDto);
    }

    @Get()
    findAll() {
        return this.priceService.findAll();
    }

    @Get('cafe/:cafeId')
    findOneByCafeId(@Param('cafeId') cafeId: string) {
        return this.priceService.findOneByCafeId(BigInt(cafeId));
    }

    @Get(':priceId')
    findOne(@Param('priceId') priceId: string) {
        return this.priceService.findOne(BigInt(priceId));
    }

    @Patch(':priceId')
    update(
        @Param('priceId') priceId: string,
        @Body() updatePriceDto: UpdatePriceDto
    ) {
        return this.priceService.update(BigInt(priceId), updatePriceDto);
    }

    @Delete(':priceId')
    remove(@Param('priceId') priceId: string) {
        return this.priceService.remove(BigInt(priceId));
    }
}
