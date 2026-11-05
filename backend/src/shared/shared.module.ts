import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service.js'
import { HashingService } from './services/hashing.service.js'
import { SharedRoleRepository } from './repositories/shared-role.repo.js'
import { TokenService } from './services/token.service.js'
import { JwtService } from '@nestjs/jwt'

const sharedServices = [PrismaService, HashingService, SharedRoleRepository, TokenService, JwtService]

// @Global: chỉ cần import một lần ở AppModule, mọi module khác đều inject được các service này
@Global()
@Module({
  providers: sharedServices,
  exports: sharedServices,
})
export class SharedModule {}
