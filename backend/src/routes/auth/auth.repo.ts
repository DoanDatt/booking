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
}
