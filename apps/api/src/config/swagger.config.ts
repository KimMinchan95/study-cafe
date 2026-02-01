import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
    const config = new DocumentBuilder()
        .setTitle('Study Cafe API')
        .setDescription('API Documentation')
        .setVersion('1.0')
        .addTag('auth')
        .addTag('account')
        .addCookieAuth('connect.sid')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
            defaultModelsExpandDepth: -1,
        },
    });
}