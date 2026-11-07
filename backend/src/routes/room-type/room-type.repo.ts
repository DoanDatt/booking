import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../shared/services/prisma.service.js'
import { CreateRoomTypeBodyType, RoomTypeType, UpdateRoomTypeBodyType } from './room-type.model.js'

@Injectable()
export class RoomTypeRepo {
  constructor(private readonly prismaService: PrismaService) {}

  findManyByProperty(propertyId: number): Promise<RoomTypeType[]> {
    return this.prismaService.roomType.findMany({
      where: { propertyId, deletedAt: null },
      orderBy: { pricePerNight: 'asc' },
    })
  }

  // Luôn lọc theo cả propertyId: loại phòng phải thuộc đúng chỗ ở trên URL
  findById({ id, propertyId }: { id: number; propertyId: number }): Promise<RoomTypeType | null> {
    return this.prismaService.roomType.findFirst({
      where: { id, propertyId, deletedAt: null },
    })
  }

  create({ propertyId, data }: { propertyId: number; data: CreateRoomTypeBodyType }): Promise<RoomTypeType> {
    return this.prismaService.roomType.create({
      data: {
        ...data,
        propertyId,
      },
    })
  }

  update({ id, propertyId, data }: { id: number; propertyId: number; data: UpdateRoomTypeBodyType }): Promise<RoomTypeType> {
    return this.prismaService.roomType.update({
      where: { id, propertyId, deletedAt: null },
      data,
    })
  }

  // Xóa mềm: Booking cũ vẫn trỏ được tới loại phòng này
  delete({ id, propertyId }: { id: number; propertyId: number }): Promise<RoomTypeType> {
    return this.prismaService.roomType.update({
      where: { id, propertyId, deletedAt: null },
      data: { deletedAt: new Date() },
    })
  }
}
