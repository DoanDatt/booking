import { Injectable } from '@nestjs/common'
import { AuthRepository } from './auth.repo.js'
import { HashingService } from '../../shared/services/hashing.service.js'
import { SharedRoleRepository } from '../../shared/repositories/shared-role.repo.js'
import { LoginBodyType, RegisterBodyType } from './auth.model.js'
import { isUniqueConstraintPrismaError } from '../../shared/helpers.js'
import { EmailAlreadyExistsException, InvalidCredentialsException } from './auth.error.js'
import { InvalidClassException } from '@nestjs/core/internal'
import { AccessTokenPayloadCreate } from '../../shared/types/jwt.type.js'
import { TokenService } from '../../shared/services/token.service.js'

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly hashingService: HashingService,
    private readonly sharedRoleRepository: SharedRoleRepository,
    private readonly tokenService: TokenService,
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

  async login(body: LoginBodyType & { userAgent: string; ip: string }) {
    const user = await this.authRepository.findUserByEmailIncludeRole(body.email)
    if (!user) {
      throw InvalidCredentialsException()
    }
    const isPasswordMatch = await this.hashingService.compare(body.password, user.password)

    if (!isPasswordMatch) {
      throw InvalidCredentialsException()
    }

    const device = await this.authRepository.createDevice({
      userId: user.id,
      userAgent: body.userAgent,
      ip: body.ip,
    })

    return this.generateTokens({
      userId: user.id,
      deviceId: device.id,
      roleId: user.roleId,
      roleName: user.role.name,
    })
  }

  async generateTokens({ userId, deviceId, roleId, roleName }: AccessTokenPayloadCreate) {
    const accessToken = this.tokenService.signAccessToken({ userId, deviceId, roleId, roleName })
    const refreshToken = this.tokenService.signRefreshToken({ userId })

    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.authRepository.createRefreshToken({
      token: refreshToken,
      userId,
      deviceId,
      expiresAt: new Date(decodedRefreshToken.exp * 1000),
    })

    return { accessToken, refreshToken }
  }
}
