import { Module } from '@nestjs/common'
import { ManagePropertyController } from './manage-property.controller.js'
import { PropertyController } from './property.controller.js'
import { PropertyRepo } from './property.repo.js'
import { PropertyService } from './property.service.js'

@Module({
  controllers: [PropertyController, ManagePropertyController],
  providers: [PropertyService, PropertyRepo],
  // RoomTypeModule dùng PropertyService.assertCanManage để kiểm tra quyền sở hữu
  exports: [PropertyService],
})
export class PropertyModule {}
