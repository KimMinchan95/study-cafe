import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AccountService } from '../../account/account.service';
import { RedisService } from '../../redis';
import { ErrorCode } from '@repo/shared';

export interface AccountInterface {
  accountId: string;
}

export interface SessionPayload {
  accountId: string;
}

const USER_CACHE_TTL_SECONDS = 15 * 60;
const USER_CACHE_PREFIX = 'user:';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    private readonly accountService: AccountService,
    private readonly redisService: RedisService,
  ) {
    super();
  }

  serializeUser(account: AccountInterface, done: (err: Error | null, payload?: SessionPayload) => void): void {
    done(null, { accountId: account.accountId });
  }

  async deserializeUser(payload: SessionPayload, done: (err: Error | null, user?: unknown) => void): Promise<void> {
    const cacheKey = `${USER_CACHE_PREFIX}${payload.accountId}`;

    try {
      const cached = await this.redisService.getClient().get(cacheKey);
      if (cached) {
        done(null, JSON.parse(cached));
        return;
      }

      const account = await this.accountService.findOne(BigInt(payload.accountId));
      if (account) {
        await this.redisService.getClient().set(cacheKey, JSON.stringify(account), { EX: USER_CACHE_TTL_SECONDS });
      }
      done(null, account);
    } catch (err) {
      const error: Error = err instanceof Error ? err : new Error(ErrorCode.FAILED_TO_DESERIALIZE_USER);
      done(error, null);
    }
  }
}
