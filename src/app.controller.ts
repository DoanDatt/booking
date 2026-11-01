import { Controller, Get } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import { HealthResDTO } from './app.dto.js'
import { AppService } from './app.service.js'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Kiểm tra server và database có sống không
  @Get('health')
  @ZodResponse({ type: HealthResDTO })
  health() {
    return this.appService.health()
  }
}
