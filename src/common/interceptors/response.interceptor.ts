import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponseDto } from '../dto/response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, IResponseDto<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<IResponseDto<T>> {
        return next.handle().pipe(
            map((data) => {
                const response: IResponseDto<T> = {
                    statusCode: HttpStatus.OK,
                    status: 'success',
                    message: data?.message || 'Success',
                    data: data?.data || data,
                    ...(data?.error && { errors: data?.errors })
                };
                return response;
            }),
        );
    }
}
