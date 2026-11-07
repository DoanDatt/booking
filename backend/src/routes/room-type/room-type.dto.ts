import { createZodDto } from 'nestjs-zod'
import {
  CreateRoomTypeBodySchema,
  GetPropertyRoomTypesParamsSchema,
  GetRoomTypeDetailResSchema,
  GetRoomTypeParamsSchema,
  GetRoomTypesResSchema,
  UpdateRoomTypeBodySchema,
} from './room-type.model.js'

export class GetRoomTypesResDTO extends createZodDto(GetRoomTypesResSchema, { codec: true }) {}

export class GetPropertyRoomTypesParamsDTO extends createZodDto(GetPropertyRoomTypesParamsSchema) {}

export class GetRoomTypeParamsDTO extends createZodDto(GetRoomTypeParamsSchema) {}

export class GetRoomTypeDetailResDTO extends createZodDto(GetRoomTypeDetailResSchema, { codec: true }) {}

export class CreateRoomTypeBodyDTO extends createZodDto(CreateRoomTypeBodySchema) {}

export class UpdateRoomTypeBodyDTO extends createZodDto(UpdateRoomTypeBodySchema) {}
