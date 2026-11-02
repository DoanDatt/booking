import { createZodDto } from 'nestjs-zod'
import {
  CreateLanguageBodySchema,
  GetLanguageDetailResSchema,
  GetLanguageParamsSchema,
  GetLanguagesResSchema,
  UpdateLanguageBodySchema,
} from './language.model.js'

export class GetLanguagesResDTO extends createZodDto(GetLanguagesResSchema, { codec: true }) {}

export class GetLanguageParamsDTO extends createZodDto(GetLanguageParamsSchema) {}

export class GetLanguageDetailResDTO extends createZodDto(GetLanguageDetailResSchema, { codec: true }) {}
// chỗ khác là có thêm tham số {codec: true}, vì schema này chứa DateTimeSchema  và dùng cho response
// codec: true quyết định nestjs-zod dùng schema cho chiều nào, thiếu nó thì api sẽ lỗi 500

export class CreateLanguageBodyDTO extends createZodDto(CreateLanguageBodySchema) {}
// tạo 1 class tên là CreateLanguageBodyDTO và export ra cho controller dùng
// extends createZodDto(CreateLanguageBodySchema): createZodDto nhận schema và trả về 1 class. Class này kế thừa từ class trả về của createZodDto. Class này sẽ có các property và validation rules giống như schema.

export class UpdateLanguageBodyDTO extends createZodDto(UpdateLanguageBodySchema) {}
