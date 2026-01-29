import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma';
import { AppConfigModule } from './config';
import { LoggerModule } from 'nestjs-pino';
import { AccountService } from './account/account.service';
import { AccountModule } from './account/account.module';

@Module({
    imports: [AppConfigModule, PrismaModule, LoggerModule.forRoot(), AccountModule],
    controllers: [AppController],
    providers: [AppService, AccountService],
})
export class AppModule { }
