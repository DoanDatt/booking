import { createZodDto } from 'nestjs-zod'
import { GetUserProfileResSchema } from '../../shared/models/shared-user.model.js'

export class GetUserProfileResDTO extends createZodDto(GetUserProfileResSchema, { codec: true }) {}
