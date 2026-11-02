import { createZodDto } from 'nestjs-zod'
import { HealthResSchema } from './app.model.js'

export class HealthResDTO extends createZodDto(HealthResSchema) {}
