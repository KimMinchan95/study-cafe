import { Module } from '@nestjs/common';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { PrismaModule } from '../prisma';
import { WithCafeIdDto } from '../common';

@Module({
    imports: [PrismaModule, WithCafeIdDto],
    controllers: [PriceController],
    providers: [PriceService],
    exports: [PriceService],
})
export class PriceModule {}
