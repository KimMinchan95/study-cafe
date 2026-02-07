import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
import { AppConfigService } from '../config';
import { RedisService } from '../redis';

/**
 * express-session + passport를 Nest 라우트보다 먼저 실행시키기 위한 미들웨어.
 * Nest 미들웨어로 등록해 라우트 핸들러보다 먼저 실행되도록 함.
 */
@Injectable()
export class SessionMiddleware implements NestMiddleware {
    constructor(
        private readonly config: AppConfigService,
        private readonly redis: RedisService
    ) {}

    use(req: Request, res: Response, next: NextFunction): void {
        // OPTIONS 요청은 CORS preflight이므로 세션 미들웨어를 건너뜀
        if (req.method === 'OPTIONS') {
            next();
            return;
        }

        /* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
        const sessionMiddleware = session({
            store: this.redis.getSessionStore(),
            secret: this.config.sessionSecret,
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: this.config.isProduction,
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000,
            },
        });

        sessionMiddleware(req, res, (err?: Error) => {
            if (err) {
                next(err);
                return;
            }
            passport.initialize()(req, res, (err2?: Error) => {
                if (err2) {
                    next(err2);
                    return;
                }
                passport.session()(req, res, next);
            });
        });
    }
}
