import { Injectable } from '@nestjs/common'
import { BrandRepo } from './brand.repo.js'
import { NotFoundRecordException } from '../../shared/error.js'
import { CreateBrandBodyType, UpdateBrandBodyType } from './brand.model.js'
import { isNotFoundPrismaError } from '../../shared/helpers.js'

@Injectable()
export class BrandService {
  constructor(private readonly brandRepo: BrandRepo) {}

  async findAll() {
    const data = await this.brandRepo.findAll()
    return {
      data,
      totalItems: data.length,
    }
  }

  async findById(id: number) {
    const data = await this.brandRepo.findById(id)
    if (!data) {
      throw NotFoundRecordException()
    }
    return data
  }

  create({ data, createdById }: { data: CreateBrandBodyType; createdById: number | null }) {
    return this.brandRepo.create({ data, createdById })
  }

  async update({ id, data, updatedById }: { id: number; data: UpdateBrandBodyType; updatedById: number | null }) {
    try {
      return await this.brandRepo.update({ id, data, updatedById })
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException()
      }
      throw error
    }
  }
  async delete({ id, deletedById }: { id: number; deletedById: number | null }) {
    try {
      await this.brandRepo.delete({ id, deletedById })
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
