import { Injectable } from '@nestjs/common'
import { ProfileRepository } from './profile.repo.js'
import { NotFoundRecordException } from '../../shared/error.js'

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}
  async getProfile(userId: number) {
    const user = await this.profileRepository.findById(userId)
    // token còn hạn nhưng user đã bị xóa -> kh tìm thấy
    if (!user) {
      throw NotFoundRecordException()
    }
    return user
  }
}
