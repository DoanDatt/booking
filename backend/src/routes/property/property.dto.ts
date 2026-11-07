import { createZodDto } from 'nestjs-zod'
import {
  CreatePropertyBodySchema,
  GetManagePropertiesQuerySchema,
  GetManagePropertiesResSchema,
  GetManagePropertyDetailResSchema,
  GetPropertiesQuerySchema,
  GetPropertiesResSchema,
  GetPropertyDetailResSchema,
  GetPropertyParamsSchema,
  UpdatePropertyBodySchema,
  UpdatePropertyStatusBodySchema,
} from './property.model.js'

// Công khai
export class GetPropertiesQueryDTO extends createZodDto(GetPropertiesQuerySchema) {}
export class GetPropertiesResDTO extends createZodDto(GetPropertiesResSchema, { codec: true }) {}
export class GetPropertyParamsDTO extends createZodDto(GetPropertyParamsSchema) {}
export class GetPropertyDetailResDTO extends createZodDto(GetPropertyDetailResSchema, { codec: true }) {}

// Quản lý
export class GetManagePropertiesQueryDTO extends createZodDto(GetManagePropertiesQuerySchema) {}
export class GetManagePropertiesResDTO extends createZodDto(GetManagePropertiesResSchema, { codec: true }) {}
export class GetManagePropertyDetailResDTO extends createZodDto(GetManagePropertyDetailResSchema, { codec: true }) {}
export class CreatePropertyBodyDTO extends createZodDto(CreatePropertyBodySchema) {}
export class UpdatePropertyBodyDTO extends createZodDto(UpdatePropertyBodySchema) {}
export class UpdatePropertyStatusBodyDTO extends createZodDto(UpdatePropertyStatusBodySchema) {}
