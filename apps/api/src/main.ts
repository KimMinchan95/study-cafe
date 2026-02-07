import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { AppConfigService } from './config';
import { RedisService } from './redis';
import { Logger } from 'nestjs-pino';
import { setupSwagger } from './config';
import type { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    setupSwagger(app);

    await app.init();

    const configService = app.get(AppConfigService);
    const corsOrigin = configService.isDevelopment
        ? true
        : configService.corsOrigin;

    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.use((req, res, next) => {
        if (req.method === 'OPTIONS') {
            const origin = req.headers.origin;
            const allowedOrigin = corsOrigin === true ? origin : corsOrigin;

            if (corsOrigin === true || (origin && origin === corsOrigin)) {
                res.header('Access-Control-Allow-Origin', allowedOrigin || '*');
                res.header(
                    'Access-Control-Allow-Methods',
                    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
                );
                res.header(
                    'Access-Control-Allow-Headers',
                    'Content-Type, Authorization, Accept, Origin, X-Requested-With'
                );
                res.header('Access-Control-Allow-Credentials', 'true');
                res.status(204).end();
                return;
            }
            res.status(403).end();
            return;
        }
        next();
    });

    app.enableCors({
        origin: corsOrigin,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Accept',
            'Origin',
            'X-Requested-With',
        ],
        exposedHeaders: ['Content-Type'],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });

    app.useLogger(app.get(Logger));
    const redisService = app.get(RedisService);
    const redisClient = redisService.getClient();
    redisClient.on('error', (err: Error) =>
        app.get(Logger).error(err, 'Redis Client Error')
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
        })
    );

    await app.listen(configService.port, '0.0.0.0');
}
void bootstrap();
