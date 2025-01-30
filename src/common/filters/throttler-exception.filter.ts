import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Response } from 'express';

@Catch(ThrottlerException)
export class ThrottlerFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    response.status(429).json({
      statusCode: 429,
      message: 'Rate limit exceeded. Please try again later.',
      error: 'Too Many Requests',
    });
  }
}
