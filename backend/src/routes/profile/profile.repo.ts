import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../shared/services/prisma.service.js'

@Injectable()
export class ProfileRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findById(userId: number) {
    return this.prismaService.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
      omit: {
        password: true,
        totpSecret: true,
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
  }
}
