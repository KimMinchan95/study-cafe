import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiSuccessResponse } from '../interfaces/api-response.interface';

/** JSON 직렬화 시 bigint를 문자열로 변환 (cafe는 toCafeResponse로 처리, 그 외 Prisma bigint 방지) */
function stripBigInt<T>(value: T): T {
  if (value === null || value === undefined) return value;
  if (typeof value === 'bigint') return String(value) as unknown as T;
  if (Array.isArray(value)) return value.map(stripBigInt) as unknown as T;
  if (typeof value === 'object' && value.constructor === Object) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = stripBigInt(v);
    return out as unknown as T;
  }
  return value;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiSuccessResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiSuccessResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true as const,
        data: stripBigInt(data) as T,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
