import { Module } from '@nestjs/common'
import { BrandController } from './brand.controller.js'
import { BrandService } from './brand.service.js'
import { BrandRepo } from './brand.repo.js'

@Module({
  controllers: [BrandController],
  providers: [BrandService, BrandRepo],
})
export class BrandModule {}
