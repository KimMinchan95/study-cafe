import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { ENV_KEYS } from './env-key.constant';
import { Environment, EnvironmentVariables } from './env.config';

@Injectable()
export class AppConfigService {
    constructor(
        private configService: NestConfigService<EnvironmentVariables, true>
    ) {}

    get nodeEnv(): Environment {
        return this.configService.get(ENV_KEYS.NODE_ENV, { infer: true });
    }

    get port(): number {
        return this.configService.get(ENV_KEYS.PORT, { infer: true });
    }

    get databaseUrl(): string {
        return this.configService.get(ENV_KEYS.DATABASE_URL, { infer: true });
    }

    get corsOrigin(): string {
        return this.configService.get(ENV_KEYS.CORS_ORIGIN, { infer: true });
    }

    get redisHost(): string {
        return this.configService.get(ENV_KEYS.REDIS_HOST, { infer: true });
    }

    get redisPort(): number {
        return this.configService.get(ENV_KEYS.REDIS_PORT, { infer: true });
    }

    get redisPassword(): string | undefined {
        return this.configService.get(ENV_KEYS.REDIS_PASSWORD, { infer: true });
    }

    get sessionSecret(): string {
        return this.configService.get(ENV_KEYS.SESSION_SECRET, { infer: true });
    }

    get bcryptSaltRounds(): number {
        return (
            this.configService.get(ENV_KEYS.BCRYPT_SALT_ROUNDS, {
                infer: true,
            }) ?? 10
        );
    }

    get isDevelopment(): boolean {
        return this.nodeEnv === Environment.Development;
    }

    get isProduction(): boolean {
        return this.nodeEnv === Environment.Production;
    }
}
