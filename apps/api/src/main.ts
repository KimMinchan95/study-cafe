import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import session from 'express-session';
import passport from 'passport';
import { AppModule } from './app.module';
import { ResponseInterceptor, HttpExceptionFilter } from './common';
import { AppConfigService } from './config';
import { RedisService } from './redis';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.init();

    app.useLogger(app.get(Logger));
    const configService = app.get(AppConfigService);
    const redisService = app.get(RedisService);

    const redisClient = redisService.getClient();
    redisClient.on('error', (err: Error) => app.get(Logger).error(err, 'Redis Client Error'));

    app.use(
        // express-session은 CommonJS라 타입 해석 시 경고 발생
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        session({
            store: redisService.getSessionStore(),
            secret: configService.sessionSecret,
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: configService.isProduction,
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000,
            },
        }),
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    app.use(passport.initialize());
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    app.use(passport.session());

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    // 전역 ValidationPipe 등록
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // 전역 인터셉터 & 필터 등록
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());

    app.enableCors({
        origin: configService.corsOrigin,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    });

    await app.listen(configService.port);
    console.log(`Server running on http://localhost:${configService.port}`);
}
void bootstrap();
