import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      const message =
        typeof payload === 'object' && payload !== null && 'message' in payload
          ? payload.message
          : exception.message;
      const error =
        typeof payload === 'object' && payload !== null && 'error' in payload
          ? payload.error
          : exception.name;

      response.status(status).json({
        success: false,
        message,
        error,
      });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error',
      error: exception instanceof Error ? exception.name : 'Error',
    });
  }
}