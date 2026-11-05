import { HttpException, Injectable } from '@nestjs/common'
import { AuthRepository } from './auth.repo.js'
import { HashingService } from '../../shared/services/hashing.service.js'
import { SharedRoleRepository } from '../../shared/repositories/shared-role.repo.js'
import { LoginBodyType, RefreshTokenBodyType, RegisterBodyType } from './auth.model.js'
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from '../../shared/helpers.js'
import {
  EmailAlreadyExistsException,
  InvalidCredentialsException,
  RefreshTokenAlreadyUsedException,
  UnauthorizedAccessException,
} from './auth.error.js'
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

  async refreshToken({ refreshToken, userAgent, ip }: RefreshTokenBodyType & { userAgent: string; ip: string }) {
    try {
      // 1. Kiểm tra chữ ký và hạn (sai → ném lỗi của thư viện JWT)
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)

      // 2. Kiểm tra token còn trong DB không
      const refreshTokenInDb = await this.authRepository.findRefreshTokenIncludeUserRole(refreshToken)
      if (!refreshTokenInDb) {
        throw RefreshTokenAlreadyUsedException()
      }

      const { deviceId, user } = refreshTokenInDb

      // 3. Cập nhật thông tin thiết bị (IP có thể đã đổi)
      await this.authRepository.updateDevice(deviceId, { ip, userAgent })

      // 4. Xóa token cũ → nó chỉ dùng được 1 lần
      await this.authRepository.deleteRefreshToken(refreshToken)

      // 5. Cấp cặp mới, role lấy MỚI NHẤT từ DB
      return await this.generateTokens({ userId, deviceId, roleId: user.roleId, roleName: user.role.name })
    } catch (error) {
      // Lỗi mình tự ném (AlreadyUsed) thì giữ nguyên
      if (error instanceof HttpException) {
        throw error
      }
      // Lỗi khác (sai chữ ký, hết hạn...) → 401
      throw UnauthorizedAccessException()
    }
  }

  async logout(refreshToken: string) {
    try {
      // 1. Kiểm tra chữ ký và hạn
      await this.tokenService.verifyRefreshToken(refreshToken)
      // 2. Xóa token (không có trong DB → Prisma ném P2025)
      const deletedRefreshToken = await this.authRepository.deleteRefreshToken(refreshToken)
      // 3. Đánh dấu thiết bị đã đăng xuất
      await this.authRepository.updateDevice(deletedRefreshToken.deviceId, { isActive: false })
      return { message: 'Logout successfully' }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw RefreshTokenAlreadyUsedException()
      }
      throw UnauthorizedAccessException()
    }
  }
}
