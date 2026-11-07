import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../shared/services/prisma.service.js'
import { AmenityType, CreateAmenityBodyType, UpdateAmenityBodyType } from './amenity.model.js'

@Injectable()
export class AmenityRepo {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(): Promise<AmenityType[]> {
    return this.prismaService.amenity.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: 'asc',
      },
    })
  }

  findById(id: number): Promise<AmenityType | null> {
    return this.prismaService.amenity.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    })
  }

  create({ createdById, data }: { createdById: number | null; data: CreateAmenityBodyType }): Promise<AmenityType> {
    return this.prismaService.amenity.create({
      data: {
        ...data,
        createdById,
      },
    })
  }

  update({
    id,
    updatedById,
    data,
  }: {
    id: number
    updatedById: number | null
    data: UpdateAmenityBodyType
  }): Promise<AmenityType> {
    return this.prismaService.amenity.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        ...data,
        updatedById,
      },
    })
  }

  // Xóa mềm: Property đang gắn tiện nghi này vẫn giữ liên kết, chỉ là không hiện trong danh sách nữa
  delete({ id, deletedById }: { id: number; deletedById: number | null }): Promise<AmenityType> {
    return this.prismaService.amenity.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
        deletedById,
      },
    })
  }
}
