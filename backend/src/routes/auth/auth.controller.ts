import { Body, Controller, HttpStatus, Ip, Post } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { ZodResponse } from 'nestjs-zod'
import {
  LoginBodyDTO,
  LoginResDTO,
  LogoutBodyDTO,
  RefreshTokenBodyDTO,
  RefreshTokenResDTO,
  RegisterBodyDTO,
  RegisterResDTO,
} from './auth.dto.js'
import { UserAgent } from '../../shared/decorators/user-agent.decorator.js'
import { MessageResDTO } from '../../shared/dtos/response.dto.js'
import { IsPublic } from '../../shared/decorators/is-public-decorator.js'

@IsPublic()
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

  // POST /auth/refresh-token
  @Post('refresh-token')
  @ZodResponse({ status: HttpStatus.OK, type: RefreshTokenResDTO })
  refreshToken(@Body() body: RefreshTokenBodyDTO, @UserAgent() userAgent: string, @Ip() ip: string) {
    return this.authService.refreshToken({ ...body, userAgent, ip })
  }

  // POST /auth/logout
  @Post('logout')
  @ZodResponse({ status: HttpStatus.OK, type: MessageResDTO })
  logout(@Body() body: LogoutBodyDTO) {
    return this.authService.logout(body.refreshToken)
  }
}
