import { Injectable } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'
import envConfig from '../config.js'

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    // Prisma 7 kết nối DB qua "driver adapter" (ở đây là node-postgres)
    const adapter = new PrismaPg({
      connectionString: envConfig.DATABASE_URL,
    })
    super({ adapter, log: ['info'] })
  }
}
