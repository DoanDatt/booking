import { createZodDto } from 'nestjs-zod'
import {
  CreateCityBodySchema,
  GetCitiesResSchema,
  GetCityBySlugParamsSchema,
  GetCityDetailResSchema,
  GetCityParamsSchema,
  UpdateCityBodySchema,
} from './city.model.js'

export class GetCityResDTO extends createZodDto(GetCitiesResSchema, { codec: true }) {}

export class GetCityParamsDTO extends createZodDto(GetCityParamsSchema) {}

export class GetCityDetailResDTO extends createZodDto(GetCityDetailResSchema, { codec: true }) {}
// chỗ khác là có thêm tham số {codec: true}, vì schema này chứa DateTimeSchema  và dùng cho response
// codec: true quyết định nestjs-zod dùng schema cho chiều nào, thiếu nó thì api sẽ lỗi 500

export class GetCityBySlugDTO extends createZodDto(GetCityBySlugParamsSchema) {}

export class CreateCityBodyDTO extends createZodDto(CreateCityBodySchema) {}
// tạo 1 class tên là CreateCityBodyDTO và export ra cho controller dùng
// extends createZodDto(CreateCityBodySchema): createZodDto nhận schema và trả về 1 class. Class này kế thừa từ class trả về của createZodDto. Class này sẽ có các property và validation rules giống như schema.

export class UpdateCityBodyDTO extends createZodDto(UpdateCityBodySchema) {}
