import { createZodDto } from 'nestjs-zod'
import {
  CreateAmenityBodySchema,
  GetAmenitiesResSchema,
  GetAmenityDetailResSchema,
  GetAmenityParamsSchema,
  UpdateAmenityBodySchema,
} from './amenity.model.js'

export class GetAmenitiesResDTO extends createZodDto(GetAmenitiesResSchema, { codec: true }) {}

export class GetAmenityParamsDTO extends createZodDto(GetAmenityParamsSchema) {}

export class GetAmenityDetailResDTO extends createZodDto(GetAmenityDetailResSchema, { codec: true }) {}

export class CreateAmenityBodyDTO extends createZodDto(CreateAmenityBodySchema) {}

export class UpdateAmenityBodyDTO extends createZodDto(UpdateAmenityBodySchema) {}
