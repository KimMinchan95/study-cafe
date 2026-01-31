import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma';
import { AppConfigModule } from './config';
import { PasswordModule } from './password';
import { LoggerModule } from 'nestjs-pino';
import { AccountService } from './account/account.service';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [AppConfigModule, PrismaModule, PasswordModule, LoggerModule.forRoot(), AccountModule, AuthModule],
    controllers: [AppController],
    providers: [AppService, AccountService],
})
export class AppModule { }
