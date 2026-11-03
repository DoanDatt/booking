import { Injectable } from '@nestjs/common'
import { AuthRepository } from './auth.repo.js'
import { HashingService } from '../../shared/services/hashing.service.js'
import { SharedRoleRepository } from '../../shared/repositories/shared-role.repo.js'
import { RegisterBodyType } from './auth.model.js'
import { isUniqueConstraintPrismaError } from '../../shared/helpers.js'
import { EmailAlreadyExistsException } from './auth.error.js'

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly hashingService: HashingService,
    private readonly sharedRoleRepository: SharedRoleRepository,
  ) {}

  async register(body: RegisterBodyType) {
    try {
      const clientRoleId = await this.sharedRoleRepository.getClientRoleId()
      const hashedPassword = await this.hashingService.hash(body.password)

      return await this.authRepository.createUser({
        email: body.email,
        name: body.name,
        phoneNumber: body.phoneNumber,
        password: hashedPassword,
        roleId: clientRoleId,
      })
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw EmailAlreadyExistsException()
      }
      throw error
    }
  }
}
