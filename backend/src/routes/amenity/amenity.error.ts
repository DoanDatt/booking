import { UnprocessableEntityException } from '@nestjs/common'

export const AmenityNameAlreadyExistsException = () =>
  new UnprocessableEntityException([{ message: 'Error.AmenityNameAlreadyExists', path: 'name' }])
