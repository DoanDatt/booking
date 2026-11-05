import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../shared/services/prisma.service.js'
import { UserType } from '../../shared/models/shared-user.model.js'

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createUser(
    user: Pick<UserType, 'email' | 'name' | 'password' | 'phoneNumber' | 'roleId'>,
  ): Promise<Omit<UserType, 'password' | 'totpSecret'>> {
    return this.prismaService.user.create({
      data: user,
      omit: { password: true, totpSecret: true },
    })
  }

  // tìm user theo email, kèm luôn thông tin role (cần roleName để ký token)
  findUserByEmailIncludeRole(email: string) {
    return this.prismaService.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
      include: { role: true },
    })
  }

  createDevice(data: { userId: number; userAgent: string; ip: string }) {
    return this.prismaService.device.create({ data })
  }

  createRefreshToken(data: { token: string; userId: number; deviceId: number; expiresAt: Date }) {
    return this.prismaService.refreshToken.create({ data })
  }

  // token là @unique trong schema → dùng findUnique được
  findRefreshTokenIncludeUserRole(token: string) {
    return this.prismaService.refreshToken.findUnique({
      where: { token },
      include: { user: { include: { role: true } } }, // lồng 2 tầng: token → user → role
    })
  }

  updateDevice(deviceId: number, data: { ip?: string; userAgent?: string; isActive?: boolean }) {
    return this.prismaService.device.update({ where: { id: deviceId }, data })
  }

  deleteRefreshToken(token: string) {
    return this.prismaService.refreshToken.delete({ where: { token } })
  }
}
