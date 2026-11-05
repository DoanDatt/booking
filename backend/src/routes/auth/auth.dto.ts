import { createZodDto } from 'nestjs-zod'
import { LoginBodySchema, LoginResSchema, RegisterBodySchema, RegisterResSchema } from './auth.model.js'

export class RegisterBodyDTO extends createZodDto(RegisterBodySchema) {}
export class RegisterResDTO extends createZodDto(RegisterResSchema, { codec: true }) {}

export class LoginBodyDTO extends createZodDto(LoginBodySchema) {}
export class LoginResDTO extends createZodDto(LoginResSchema) {}
