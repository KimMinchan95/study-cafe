import { Module } from '@nestjs/common';
import { BadgeService } from './badge.service';
import { BadgeController } from './badge.controller';
import { PrismaModule } from '../prisma';

@Module({
    imports: [PrismaModule],
    controllers: [BadgeController],
    providers: [BadgeService],
    exports: [BadgeService],
})
export class BadgeModule {}
