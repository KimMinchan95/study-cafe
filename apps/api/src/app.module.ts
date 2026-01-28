import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma';
import { AppConfigModule } from './config';
import { LoggerModule } from 'nestjs-pino';

@Module({
    imports: [AppConfigModule, PrismaModule, LoggerModule.forRoot()],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
