import { Injectable } from '@nestjs/common'
import { NotFoundRecordException } from '../../shared/error.js'
import { isNotFoundPrismaError } from '../../shared/helpers.js'
import { AccessTokenPayload } from '../../shared/types/jwt.type.js'
import { PropertyService } from '../property/property.service.js'
import { CreateRoomTypeBodyType, UpdateRoomTypeBodyType } from './room-type.model.js'
import { RoomTypeRepo } from './room-type.repo.js'

@Injectable()
export class RoomTypeService {
  constructor(
    private readonly roomTypeRepo: RoomTypeRepo,
    // Dùng lại phần kiểm tra quyền sở hữu chỗ ở (404 / 403)
    private readonly propertyService: PropertyService,
  ) {}

  async findManyByProperty(propertyId: number, user: AccessTokenPayload) {
    await this.propertyService.assertCanManage(propertyId, user)
    const data = await this.roomTypeRepo.findManyByProperty(propertyId)
    return {
      data,
      totalItems: data.length,
    }
  }

  async create(propertyId: number, data: CreateRoomTypeBodyType, user: AccessTokenPayload) {
    await this.propertyService.assertCanManage(propertyId, user)
    return this.roomTypeRepo.create({ propertyId, data })
  }

  async update(
    { propertyId, roomTypeId }: { propertyId: number; roomTypeId: number },
    data: UpdateRoomTypeBodyType,
    user: AccessTokenPayload,
  ) {
    await this.propertyService.assertCanManage(propertyId, user)
    try {
      return await this.roomTypeRepo.update({ id: roomTypeId, propertyId, data })
    } catch (error) {
      // P2025: loại phòng không tồn tại, đã xóa, hoặc thuộc chỗ ở khác
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException()
      }
      throw error
    }
  }

  async delete({ propertyId, roomTypeId }: { propertyId: number; roomTypeId: number }, user: AccessTokenPayload) {
    await this.propertyService.assertCanManage(propertyId, user)
    try {
      await this.roomTypeRepo.delete({ id: roomTypeId, propertyId })
      return {
        message: 'Delete Successfully',
      }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException()
      }
      throw error
    }
  }
}
