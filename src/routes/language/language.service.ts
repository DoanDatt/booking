import { Injectable } from '@nestjs/common'
import { LanguageRepo } from './language.repo.js'
import { NotFoundRecordException } from '../../shared/error.js'
import { CreateLanguageBodyType, UpdateLanguageBodyType } from './language.model.js'
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from '../../shared/helpers.js'
import { LanguageAlreadyExistsException } from './language.error.js'

@Injectable()
export class LanguageService {
  constructor(private readonly languageRepo: LanguageRepo) {}

  // gói thành mảng {data, totalItems} cho khớp GetLanguageSchema
  async findAll() {
    const data = await this.languageRepo.findAll()
    return {
      data,
      totalItems: data.length,
    }
  }

  async findById(id: string) {
    const language = await this.languageRepo.findById(id)
    if (!language) {
      throw NotFoundRecordException()
    }
    return language
  }

  async create({ data, createdById }: { data: CreateLanguageBodyType; createdById: number | null }) {
    try {
      return await this.languageRepo.create({ data, createdById })
    } catch (error) {
      // P2002: id đã tồn tại
      if (isUniqueConstraintPrismaError(error)) {
        throw LanguageAlreadyExistsException()
      }
      throw error
    }
  }

  async update({ id, data, updatedById }: { id: string; data: UpdateLanguageBodyType; updatedById: number | null }) {
    try {
      return await this.languageRepo.update({ id, data, updatedById })
    } catch (error) {
      // P2025: không có dòng nào khớp where (không tồn tại hoặc đã xóa mềm)
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException()
      }
      throw error
    }
  }

  // xóa dứng: nếu xóa mềm thì id cũ vẫn chiếm chỗ, không tạo lại được ngôn ngữ đ
  async delete({ id, deletedById }: { id: string; deletedById: number | null }) {
    try {
      await this.languageRepo.delete({ id, deletedById, isHard: true })
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
