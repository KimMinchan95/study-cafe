import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ResponseInterceptor, HttpExceptionFilter } from './common';
import { AppConfigService } from './config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(AppConfigService);

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
