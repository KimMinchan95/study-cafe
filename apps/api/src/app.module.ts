import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma';
import { AppConfigModule } from './config';

@Module({
    imports: [AppConfigModule, PrismaModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
