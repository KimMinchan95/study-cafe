import { Module } from '@nestjs/common';
import { BadgeService } from './badge.service';
import { BadgeController } from './badge.controller';
import { PrismaModule } from '../prisma';
import { WithCafeIdDto } from '../common';

@Module({
    imports: [PrismaModule, WithCafeIdDto],
    controllers: [BadgeController],
    providers: [BadgeService],
    exports: [BadgeService],
})
export class BadgeModule {}
