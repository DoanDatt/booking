import { Injectable } from '@nestjs/common'
import { NotFoundRecordException } from '../../shared/error.js'
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from '../../shared/helpers.js'
import { AmenityNameAlreadyExistsException } from './amenity.error.js'
import { CreateAmenityBodyType, UpdateAmenityBodyType } from './amenity.model.js'
import { AmenityRepo } from './amenity.repo.js'

@Injectable()
export class AmenityService {
  constructor(private readonly amenityRepo: AmenityRepo) {}

  async findAll() {
    const data = await this.amenityRepo.findAll()
    return {
      data,
      totalItems: data.length,
    }
  }

  async findById(id: number) {
    const data = await this.amenityRepo.findById(id)
    if (!data) {
      throw NotFoundRecordException()
    }
    return data
  }

  async create({ data, createdById }: { data: CreateAmenityBodyType; createdById: number | null }) {
    try {
      return await this.amenityRepo.create({ data, createdById })
    } catch (error) {
      // P2002: tên tiện nghi đã tồn tại
      if (isUniqueConstraintPrismaError(error)) {
        throw AmenityNameAlreadyExistsException()
      }
      throw error
    }
  }

  async update({ id, data, updatedById }: { id: number; data: UpdateAmenityBodyType; updatedById: number | null }) {
    try {
      return await this.amenityRepo.update({ id, data, updatedById })
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw AmenityNameAlreadyExistsException()
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
      await this.amenityRepo.delete({ id, deletedById })
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
