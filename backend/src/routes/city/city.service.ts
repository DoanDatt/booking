import { Injectable } from '@nestjs/common'
import { CityRepo } from './city.repo.js'
import { NotFoundRecordException } from '../../shared/error.js'
import { CreateCityBodyType, UpdateCityBodyType } from './city.model.js'
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from '../../shared/helpers.js'
import { CitySlugAlreadyExistsException } from './city.error.js'

@Injectable()
export class CityService {
  constructor(private readonly cityRepo: CityRepo) {}
  async findAll() {
    const data = await this.cityRepo.findAll()
    return {
      data,
      totalItems: data.length,
    }
  }
  async findById(id: number) {
    const data = await this.cityRepo.findById(id)
    if (!data) {
      throw NotFoundRecordException()
    }
    return data
  }

  async findBySlug(slug: string) {
    const data = await this.cityRepo.findBySlug(slug)
    if (!data) {
      throw NotFoundRecordException()
    }
    return data
  }

  async create({ data, createdById }: { data: CreateCityBodyType; createdById: number | null }) {
    try {
      return await this.cityRepo.create({ data, createdById })
    } catch (error) {
      // P2002:slug đã tồn tại
      if (isUniqueConstraintPrismaError(error)) {
        throw CitySlugAlreadyExistsException()
      }
      throw error
    }
  }

  async update({ id, data, updatedById }: { id: number; data: UpdateCityBodyType; updatedById: number | null }) {
    try {
      return await this.cityRepo.update({ id, data, updatedById })
    } catch (error) {
      // P2002: slug mới trùng với City khác
      if (isUniqueConstraintPrismaError(error)) {
        throw CitySlugAlreadyExistsException()
      }
      // P2025: không có dòng nào khớp where (không tồn tại hoặc đã xóa mềm)
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException()
      }
      throw error
    }
  }

  async delete({ id, deletedById }: { id: number; deletedById: number | null }) {
    try {
      await this.cityRepo.delete({ id, deletedById })
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
