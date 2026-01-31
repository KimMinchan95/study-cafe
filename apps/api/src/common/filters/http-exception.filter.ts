import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiErrorResponse } from '../interfaces/api-response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = '서버 내부 오류가 발생했습니다';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      code = this.getErrorCode(status);

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }
      if (typeof exceptionResponse === 'object') {
        const res = exceptionResponse as Record<string, unknown>;
        message = this.extractMessage(res);
      }
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      const errText =
        exception instanceof Error ? exception.stack : String(exception);
      this.logger.error(errText);
    }

    const errorResponse: ApiErrorResponse = {
      success: false,
      error: {
        code,
        message,
      },
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }

  private getErrorCode(status: number): string {
    const codeMap: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR',
    };
    return codeMap[status] || 'UNKNOWN_ERROR';
  }

  private extractMessage(res: Record<string, unknown>): string {
    if (Array.isArray(res.message)) {
      return res.message[0];
    }
    if (typeof res.message === 'string') {
      return res.message;
    }
    return '요청을 처리할 수 없습니다';
  }
}
