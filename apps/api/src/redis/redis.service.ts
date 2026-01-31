import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, type RedisClientType } from 'redis';
import { RedisStore } from 'connect-redis';
import { AppConfigService } from '../config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: RedisClientType;
  private store!: RedisStore;

  constructor(private readonly config: AppConfigService) { }

  async onModuleInit(): Promise<void> {
    const redisUrl = this.config.redisPassword
      ? `redis://:${this.config.redisPassword}@${this.config.redisHost}:${this.config.redisPort}`
      : `redis://${this.config.redisHost}:${this.config.redisPort}`;

    this.client = createClient({ url: redisUrl });
    await this.client.connect();

    this.store = new RedisStore({
      client: this.client,
      prefix: 'sess:',
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }

  getClient(): RedisClientType {
    return this.client;
  }

  getSessionStore(): RedisStore {
    return this.store;
  }
}
