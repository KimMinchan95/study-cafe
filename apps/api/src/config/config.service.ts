import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { Environment, EnvironmentVariables } from './env.config';

@Injectable()
export class AppConfigService {
  constructor(
    private configService: NestConfigService<EnvironmentVariables, true>,
  ) { }

  get nodeEnv(): Environment {
    return this.configService.get('NODE_ENV', { infer: true });
  }

  get port(): number {
    return this.configService.get('PORT', { infer: true });
  }

  get databaseUrl(): string {
    return this.configService.get('DATABASE_URL', { infer: true });
  }

  get corsOrigin(): string {
    return this.configService.get('CORS_ORIGIN', { infer: true });
  }

  get jwtSecret(): string | undefined {
    return this.configService.get('JWT_SECRET', { infer: true });
  }

  get jwtExpiresIn(): number {
    return this.configService.get('JWT_EXPIRES_IN', { infer: true });
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === Environment.Development;
  }

  get isProduction(): boolean {
    return this.nodeEnv === Environment.Production;
  }
}
