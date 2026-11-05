import { UnprocessableEntityException } from '@nestjs/common'

export const EmailAlreadyExistsException = () =>
  new UnprocessableEntityException([{ message: 'Error.EmailAlreadyExists', path: 'email' }])

// Sai email HOẶC sai mật khẩu đều báo chung 1 lỗi → không lộ email nào đã đăng ký
export const InvalidCredentialsException = () =>
  new UnprocessableEntityException([{ message: 'Error.InvalidCredentials', path: 'password' }])
