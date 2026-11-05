import { Body, Controller, HttpStatus, Ip, Post } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { ZodResponse } from 'nestjs-zod'
import { LoginBodyDTO, LoginResDTO, RegisterBodyDTO, RegisterResDTO } from './auth.dto.js'
import { UserAgent } from '../../shared/decorators/user-agent.decorator.js'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Post /auth/register
  @Post('register')
  @ZodResponse({ type: RegisterResDTO })
  register(@Body() body: RegisterBodyDTO) {
    return this.authService.register(body)
  }

  // POST /auth/login
  @Post('login')
  @ZodResponse({ status: HttpStatus.OK, type: LoginResDTO })
  login(@Body() body: LoginBodyDTO, @UserAgent() userAgent: string, @Ip() ip: string) {
    return this.authService.login({ ...body, userAgent, ip })
  }
}
