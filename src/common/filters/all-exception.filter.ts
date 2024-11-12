import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    
    const exceptionResponse = exception instanceof HttpException
      ? exception.getResponse()
      : { message: 'Internal Server Error' };

    const responseBody = {
      statusCode: status,
      status: 'fail',
      message: exceptionResponse['message'] || 'Internal Server Error',
      errors: exceptionResponse['errors'] || null,
    };

    const request = ctx.getRequest();
    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
