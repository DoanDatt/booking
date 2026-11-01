import { CallHandler, ExecutionContext, HttpException, Injectable } from '@nestjs/common'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

// 1. Serialize response theo schema của @ZodResponse (loại bỏ field thừa như password)
// 2. Bọc mọi response thành công thành { data, statusCode }
@Injectable()
export class CustomZodSerializerInterceptor extends ZodSerializerInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return super.intercept(context, next).pipe(
      map((data) => {
        const ctx = context.switchToHttp()
        const response = ctx.getResponse()
        const statusCode = response.statusCode
        return { data, statusCode }
      }),
      catchError((error) => {
        throw new HttpException(
          {
            message: error.response?.message || 'Internal server error during response serialization',
            error: error.response,
            status: error.status || 500,
          },
          error.status || 500,
        )
      }),
    )
  }
}
