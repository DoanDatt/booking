import { Injectable } from '@nestjs/common'
import { PrismaService } from '../services/prisma.service.js'
import { RoleName } from '../constants/role.constant.js'

@Injectable()
export class SharedRoleRepository {
  // Cache: lần đầu query DB, những lần sau trả luôn giá trị đã lưu
  private clientRoleId: number | null = null
  constructor(private readonly prismaService: PrismaService) {}

  async getClientRoleId() {
    if (this.clientRoleId) {
      return this.clientRoleId
    }
    // findfirstorthrow: Không tìm thấy thì ném lỗi luôn
    const role = await this.prismaService.role.findFirstOrThrow({
      where: {
        name: RoleName.Client,
        deletedAt: null,
      },
    })
    this.clientRoleId = role.id
    return role.id
  }
}
