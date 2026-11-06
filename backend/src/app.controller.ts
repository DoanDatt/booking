import { Controller, Get } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import { HealthResDTO } from './app.dto.js'
import { AppService } from './app.service.js'
import { IsPublic } from './shared/decorators/is-public-decorator.js'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @IsPublic()
  // Kiểm tra server và database có sống không
  @Get('health')
  @ZodResponse({ type: HealthResDTO })
  health() {
    return this.appService.health()
  }
}
