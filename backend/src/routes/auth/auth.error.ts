import { UnprocessableEntityException } from '@nestjs/common'

export const EmailAlreadyExistsException = () =>
  new UnprocessableEntityException([{ message: 'Error.EmailAlreadyExists', path: 'email' }])
