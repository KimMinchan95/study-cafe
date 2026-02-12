import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CafeService } from './cafe.service';
import { CreateCafeDto } from './dto/create-cafe.dto';
import { UpdateCafeDto } from './dto/update-cafe.dto';

const IMAGES_FIELD = 'images';
const IMAGES_MAX_COUNT = 10;

@ApiTags('cafe')
@Controller('cafe')
export class CafeController {
    constructor(private readonly cafeService: CafeService) {}

    @Post()
    @UseInterceptors(
        FileFieldsInterceptor([{ name: IMAGES_FIELD, maxCount: IMAGES_MAX_COUNT }], {
            storage: memoryStorage(),
        }),
    )
    @ApiConsumes('application/json', 'multipart/form-data')
    @ApiBody({ type: CreateCafeDto })
    create(
        @Body() createCafeDto: CreateCafeDto,
        @UploadedFiles() uploaded?: { [key: string]: Express.Multer.File[] },
    ) {
        const files = uploaded?.[IMAGES_FIELD];
        const dto: CreateCafeDto = {
            ...createCafeDto,
            ...(files?.length ? { images: files } : {}),
        };
        return this.cafeService.create(dto);
    }

    @Get()
    findAll() {
        return this.cafeService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.cafeService.findOne(BigInt(id));
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCafeDto: UpdateCafeDto) {
        return this.cafeService.update(BigInt(id), updateCafeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.cafeService.remove(BigInt(id));
    }
}
