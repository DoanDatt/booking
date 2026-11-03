import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { ZodResponse } from 'nestjs-zod'
import { RegisterBodyDTO, RegisterResDTO } from './auth.dto.js'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Post /auth/register
  @Post('register')
  @ZodResponse({ type: RegisterResDTO })
  register(@Body() body: RegisterBodyDTO) {
    return this.authService.register(body)
  }
}
