import { Module } from '@nestjs/common'
import { PropertyModule } from '../property/property.module.js'
import { RoomTypeController } from './room-type.controller.js'
import { RoomTypeRepo } from './room-type.repo.js'
import { RoomTypeService } from './room-type.service.js'

@Module({
  // import PropertyModule để inject PropertyService (đã được PropertyModule export)
  imports: [PropertyModule],
  controllers: [RoomTypeController],
  providers: [RoomTypeService, RoomTypeRepo],
})
export class RoomTypeModule {}
