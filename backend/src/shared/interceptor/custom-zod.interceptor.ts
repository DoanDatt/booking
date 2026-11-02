import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

// 1. Serialize response theo schema của @ZodResponse (loại bỏ field thừa như password)
// 2. Bọc mọi response thành công thành { data, statusCode }
// Lỗi không xử lý ở đây, để HttpExceptionFilter trả về nguyên format của NestJS
@Injectable()
export class CustomZodSerializerInterceptor extends ZodSerializerInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return super.intercept(context, next).pipe(
      map((data) => {
        const statusCode = context.switchToHttp().getResponse().statusCode
        return { data, statusCode }
      }),
    )
  }
}
