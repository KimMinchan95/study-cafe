import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma';
import { AppConfigModule } from './config';
import { RedisModule } from './redis';
import { PasswordModule } from './password';
import { LoggerModule } from 'nestjs-pino';
import { AccountService } from './account/account.service';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { SessionMiddleware } from './session/session.middleware';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    RedisModule,
    PasswordModule,
    LoggerModule.forRoot(),
    AccountModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, AccountService, SessionMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(SessionMiddleware).forRoutes('*');
  }
}
