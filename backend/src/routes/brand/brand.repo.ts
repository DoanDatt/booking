import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../shared/services/prisma.service.js'
import { BrandType, CreateBrandBodyType, UpdateBrandBodyType } from './brand.model.js'
import { MessageResType } from '../../shared/models/response.model.js'

@Injectable()
export class BrandRepo {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(): Promise<BrandType[]> {
    return this.prismaService.brand.findMany({
      where: {
        deletedAt: null,
      },
    })
  }

  findById(id: number): Promise<BrandType | null> {
    return this.prismaService.brand.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    })
  }

  create({ createdById, data }: { createdById: number | null; data: CreateBrandBodyType }): Promise<BrandType> {
    return this.prismaService.brand.create({
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
    data: UpdateBrandBodyType
  }): Promise<BrandType> {
    return this.prismaService.brand.update({
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

  delete({
    id,
    deletedById,
    isHard,
  }: {
    id: number
    deletedById: number | null
    isHard?: boolean
  }): Promise<BrandType> {
    return isHard
      ? this.prismaService.brand.delete({
          where: {
            id,
          },
        })
      : this.prismaService.brand.update({
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
