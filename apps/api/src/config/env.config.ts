import { plainToInstance, Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  validateSync,
} from 'class-validator';
import { ENV_KEYS } from './env-key.constant';

export enum Environment {
  Development = 'development',
  Production = 'production',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  [ENV_KEYS.NODE_ENV]: Environment = Environment.Development;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  [ENV_KEYS.PORT]: number = 3001;

  @IsString()
  [ENV_KEYS.DATABASE_URL]: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  [ENV_KEYS.CORS_ORIGIN]: string = 'http://localhost:3000';

  @IsString()
  @IsOptional()
  [ENV_KEYS.REDIS_HOST]?: string = 'localhost';

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  [ENV_KEYS.REDIS_PORT]?: number = 6379;

  @IsString()
  @IsOptional()
  [ENV_KEYS.REDIS_PASSWORD]?: string;

  @IsString()
  @IsOptional()
  [ENV_KEYS.SESSION_SECRET]?: string = 'dev-session-secret-change-in-production';

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  [ENV_KEYS.BCRYPT_SALT_ROUNDS]?: number = 10;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => Object.values(error.constraints ?? {}).join(', '))
      .join('\n');
    throw new Error(`환경 변수 검증 실패:\n${errorMessages}`);
  }

  return validatedConfig;
}
