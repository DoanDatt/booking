import { ForbiddenException, UnprocessableEntityException } from '@nestjs/common'

// SELLER đụng vào chỗ ở của người khác
export const NotPropertyOwnerException = () => new ForbiddenException('Error.NotPropertyOwner')

export const CityNotFoundException = () =>
  new UnprocessableEntityException([{ message: 'Error.CityNotFound', path: 'cityId' }])

export const AmenityNotFoundException = () =>
  new UnprocessableEntityException([{ message: 'Error.AmenityNotFound', path: 'amenityIds' }])
