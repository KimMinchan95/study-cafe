import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
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
import { CorsMiddleware } from './common/middleware/cors.middleware';
import { HttpExceptionFilter, ResponseInterceptor } from './common';
import { CafeModule } from './cafe/cafe.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

/** 카페 이미지 업로드 디렉터리 (저장·정적 제공 공통, process.cwd() 기준) */
export const UPLOADS_ROOT = join(process.cwd(), 'uploads');

@Module({
    imports: [
        AppConfigModule,
        PrismaModule,
        RedisModule,
        PasswordModule,
        LoggerModule.forRoot(),
        AccountModule,
        AuthModule,
        CafeModule,
        ServeStaticModule.forRoot({
            rootPath: UPLOADS_ROOT,
            serveRoot: '/cafe-images',
        }),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        AccountService,
        SessionMiddleware,
        CorsMiddleware,
        { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
        { provide: APP_FILTER, useClass: HttpExceptionFilter },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(CorsMiddleware).forRoutes('*');
        consumer.apply(SessionMiddleware).forRoutes('*');
    }
}
