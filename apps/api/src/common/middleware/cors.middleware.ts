import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AppConfigService } from '../../config';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
    constructor(private readonly config: AppConfigService) {}

    use(req: Request, res: Response, next: NextFunction): void {
        // OPTIONS 요청 처리 (CORS preflight)
        if (req.method === 'OPTIONS') {
            const corsOrigin = this.config.isDevelopment
                ? true
                : this.config.corsOrigin;
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

        // 다른 요청에 대해서도 CORS 헤더 추가
        const corsOrigin = this.config.isDevelopment
            ? true
            : this.config.corsOrigin;
        const origin = req.headers.origin;
        const allowedOrigin = corsOrigin === true ? origin : corsOrigin;

        if (corsOrigin === true || (origin && origin === corsOrigin)) {
            res.header('Access-Control-Allow-Origin', allowedOrigin || '*');
            res.header('Access-Control-Allow-Credentials', 'true');
        }

        next();
    }
}
