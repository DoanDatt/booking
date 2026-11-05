import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

// Tự tạo decorator giống @Body(), @Param(): lấy header User-Agent (trình duyệt nào)
export const UserAgent = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest<Request>()
  return request.headers['user-agent'] ?? ''
})
