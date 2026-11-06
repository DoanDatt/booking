import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../shared/services/prisma.service.js'
import { CityType, CreateCityBodyType, UpdateCityBodyType } from './city.model.js'

@Injectable()
export class CityRepo {
  constructor(private readonly prismaService: PrismaService) {}
  findAll(): Promise<CityType[]> {
    return this.prismaService.city.findMany({
      where: {
        deletedAt: null,
      },
      // Xếp theo slug (không dấu): theo name thì "Đ" bị xếp sau mọi chữ A–Z
      orderBy: {
        slug: 'asc',
      },
    })
  }

  findById(id: number): Promise<CityType | null> {
    return this.prismaService.city.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    })
  }

  create({ createdById, data }: { createdById: number | null; data: CreateCityBodyType }): Promise<CityType> {
    return this.prismaService.city.create({
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
    data: UpdateCityBodyType
  }): Promise<CityType> {
    return this.prismaService.city.update({
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

  delete({ id, deletedById, isHard }: { id: number; deletedById: number | null; isHard?: boolean }): Promise<CityType> {
    return isHard
      ? this.prismaService.city.delete({
          where: {
            id,
          },
        })
      : this.prismaService.city.update({
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

  findBySlug(slug: string): Promise<CityType | null> {
    return this.prismaService.city.findFirst({ where: { slug, deletedAt: null } })
  }
}
