import { Module } from '@nestjs/common'
import { AmenityController } from './amenity.controller.js'
import { AmenityRepo } from './amenity.repo.js'
import { AmenityService } from './amenity.service.js'

@Module({
  controllers: [AmenityController],
  providers: [AmenityService, AmenityRepo],
})
export class AmenityModule {}
