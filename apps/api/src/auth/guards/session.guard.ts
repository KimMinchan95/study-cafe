import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ErrorCode } from '@repo/shared';

/** Passport가 세션에서 복원한 사용자 존재 여부 확인 */
interface RequestWithAuth extends Request {
  isAuthenticated?: () => boolean;
}

@Injectable()
export class SessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithAuth>();
    const isAuthenticated =
      typeof request.isAuthenticated === 'function' ? request.isAuthenticated() : false;
    if (!isAuthenticated) {
      throw new UnauthorizedException(ErrorCode.INVALID_CREDENTIALS);
    }
    return true;
  }
}
