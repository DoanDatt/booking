import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { TokenService } from '../services/token.service.js'
import { IS_PUBLIC_KEY } from '../decorators/is-public-decorator.js'
import { REQUEST_USER_KEY } from '../constants/auth.constants.js'

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // đọc nhãn isPublic: ưu tiên ở hàm, không có thì xem ở class controller
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // hàm sẽ xử lý request, ví dụ login()
      context.getClass(), // class controller, ví dụ AuthController
    ])
    if (isPublic) {
      return true
    }

    //  Lấy token: "Bearer eyJ..." → tách theo dấu cách, lấy phần thứ 2
    const request = context.switchToHttp().getRequest()
    const accessToken = request.headers.authorization?.split(' ')[1]
    if (!accessToken) {
      throw new UnauthorizedException('Error.MissingAccessToken')
    }
    // 3. Kiểm tra chữ ký và hạn
    try {
      const payload = await this.tokenService.verifyAccessToken(accessToken)
      // 4. Gắn payload vào request để controller lấy ra dùng
      request[REQUEST_USER_KEY] = payload
      return true
    } catch {
      throw new UnauthorizedException('Error.InvalidAccessToken')
    }
  }
}
