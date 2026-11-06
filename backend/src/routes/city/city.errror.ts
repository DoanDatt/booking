import { UnprocessableEntityException } from '@nestjs/common'

export const CitySlugAlreadyExistsException = () =>
  new UnprocessableEntityException([{ message: 'Error.CitySlugAlreadyExists', path: 'slug' }])
