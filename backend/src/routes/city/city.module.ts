import { Module } from '@nestjs/common'
import { CityController } from './city.controller.js'
import { CityService } from './city.service.js'
import { CityRepo } from './city.repo.js'

@Module({
  controllers: [CityController],
  providers: [CityService, CityRepo],
})
export class CityModule {}
