import { UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'

export const EmailAlreadyExistsException = () =>
  new UnprocessableEntityException([{ message: 'Error.EmailAlreadyExists', path: 'email' }])

// Sai email HOẶC sai mật khẩu đều báo chung 1 lỗi → không lộ email nào đã đăng ký
export const InvalidCredentialsException = () =>
  new UnprocessableEntityException([{ message: 'Error.InvalidCredentials', path: 'password' }])

// Token sai, hết hạn, bị sửa...
export const UnauthorizedAccessException = () => new UnauthorizedException('Error.UnauthorizedAccess')

// Token đúng chữ ký nhưng không còn trong DB → đã dùng rồi (có thể bị đánh cắp)
export const RefreshTokenAlreadyUsedException = () => new UnauthorizedException('Error.RefreshTokenAlreadyUsed')
