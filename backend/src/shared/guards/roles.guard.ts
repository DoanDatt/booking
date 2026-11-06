import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { RoleNameType, ROLES_KEY } from '../decorators/roles.decorator.js'
import { AccessTokenPayload } from '../types/jwt.type.js'
import { REQUEST_USER_KEY } from '../constants/auth.constants.js'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    // Route cần role gì? không có nhãn @Roles -> ai cũng đăng nhập được
    const requiredRoles = this.reflector.getAllAndOverride<RoleNameType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles || requiredRoles.length === 0) {
      return true
    }
    // lấy 2 user mà accessTokenGuard đã gắn vào
    const user: AccessTokenPayload | undefined = context.switchToHttp().getRequest()[REQUEST_USER_KEY]
    // Role của user có nằm trong danh sách cho phép không
    if (!user || !requiredRoles.includes(user.roleName as RoleNameType)) {
      throw new ForbiddenException('Error.Forbidden')
    }
    return true
  }
}
