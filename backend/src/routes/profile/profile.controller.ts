import { Controller, Get } from '@nestjs/common'
import { ProfileService } from './profile.service.js'
import { ZodResponse } from 'nestjs-zod'
import { ActiveUser } from '../../shared/decorators/active-user.decorator.js'
import { GetUserProfileResDTO } from './profile.dto.js'

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get()
  @ZodResponse({ type: GetUserProfileResDTO })
  getProfile(@ActiveUser('userId') userId: number) {
    return this.profileService.getProfile(userId)
  }
}
