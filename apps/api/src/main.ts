import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor, HttpExceptionFilter } from './common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // 전역 인터셉터 & 필터 등록
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());

    app.enableCors({
        origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    });

    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
