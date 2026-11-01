import { Injectable } from '@nestjs/common'
import { HealthResType } from './app.model.js'
import { PrismaService } from './shared/services/prisma.service.js'

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}

  async health(): Promise<HealthResType> {
    await this.prismaService.$queryRaw`SELECT 1`
    return { status: 'ok', database: 'up' }
  }
}
