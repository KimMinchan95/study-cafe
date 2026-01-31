import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';
import session from 'express-session';
import { AppModule } from './app.module';
import { ResponseInterceptor, HttpExceptionFilter } from './common';
import { AppConfigService } from './config';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useLogger(app.get(Logger));
    const configService = app.get(AppConfigService);

    const redisUrl = configService.redisPassword
        ? `redis://:${configService.redisPassword}@${configService.redisHost}:${configService.redisPort}`
        : `redis://${configService.redisHost}:${configService.redisPort}`;
    const redisClient = createClient({ url: redisUrl });
    redisClient.on('error', (err) => app.get(Logger).error(err, 'Redis Client Error'));
    await redisClient.connect();

    const redisStore = new RedisStore({
        client: redisClient,
        prefix: 'sess:',
    });

    app.use(
        session({
            store: redisStore,
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
bootstrap();
