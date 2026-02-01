import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { AppConfigService } from './config';
import { RedisService } from './redis';
import { Logger } from 'nestjs-pino';
import { setupSwagger } from './config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    setupSwagger(app);

    await app.init();

    app.useLogger(app.get(Logger));
    const redisService = app.get(RedisService);
    const redisClient = redisService.getClient();
    redisClient.on('error', (err: Error) =>
        app.get(Logger).error(err, 'Redis Client Error'),
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

    const configService = app.get(AppConfigService);
    app.enableCors({
        origin: configService.corsOrigin,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    });

    await app.listen(configService.port);
    console.log(`Server running on http://localhost:${configService.port}`);
}
void bootstrap();
