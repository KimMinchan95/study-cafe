import { Module } from '@nestjs/common';
import { SeatService } from './seat.service';
import { SeatController } from './seat.controller';
import { PrismaModule } from '../prisma';
import { WithCafeIdDto } from '../common';

@Module({
    imports: [PrismaModule, WithCafeIdDto],
    controllers: [SeatController],
    providers: [SeatService],
    exports: [SeatService],
})
export class SeatModule {}
