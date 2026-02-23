import { Module } from '@nestjs/common';
import { CafeService } from './cafe.service';
import { CafeController } from './cafe.controller';
import { PrismaModule } from '../prisma';

@Module({
  imports: [PrismaModule],
  controllers: [CafeController],
  providers: [CafeService],
  exports: [CafeService],
})
export class CafeModule {}
