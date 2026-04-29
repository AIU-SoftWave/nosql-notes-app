import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import type { ApiResponse } from '../interfaces/api-response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      const rawMessage =
        typeof payload === 'object' && payload !== null && 'message' in payload
          ? payload.message
          : exception.message;

      const message = Array.isArray(rawMessage)
        ? 'Validation failed'
        : String(rawMessage ?? exception.message);
      const errors = Array.isArray(rawMessage)
        ? rawMessage.map((entry) => String(entry))
        : undefined;

      const body: ApiResponse<never> = {
        success: false,
        message,
        ...(errors ? { errors } : {}),
      };

      response.status(status).json(body);
      return;
    }

    const body: ApiResponse<never> = {
      success: false,
      message: 'Internal server error',
    };

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(body);
  }
}