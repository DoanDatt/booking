import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service.js'

const sharedServices = [PrismaService]

// @Global: chỉ cần import một lần ở AppModule, mọi module khác đều inject được các service này
@Global()
@Module({
  providers: sharedServices,
  exports: sharedServices,
})
export class SharedModule {}
