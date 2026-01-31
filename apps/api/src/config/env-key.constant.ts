/** 환경 변수 키 - env.config.ts, config.service.ts에서 공유 */
export const ENV_KEYS = {
  NODE_ENV: 'NODE_ENV',
  PORT: 'PORT',
  DATABASE_URL: 'DATABASE_URL',
  CORS_ORIGIN: 'CORS_ORIGIN',
  REDIS_HOST: 'REDIS_HOST',
  REDIS_PORT: 'REDIS_PORT',
  REDIS_PASSWORD: 'REDIS_PASSWORD',
  SESSION_SECRET: 'SESSION_SECRET',
  BCRYPT_SALT_ROUNDS: 'BCRYPT_SALT_ROUNDS',
} as const;

export type EnvKey = (typeof ENV_KEYS)[keyof typeof ENV_KEYS];
