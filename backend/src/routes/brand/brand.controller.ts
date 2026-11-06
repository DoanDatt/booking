import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'

import { MessageResDTO } from '../../shared/dtos/response.dto.js'
import {
  CreateBrandBodyDTO,
  GetBrandDetailDTO,
  GetBrandParamsDTO,
  GetBrandResDTO,
  UpdateBrandBodyDTO,
} from './brand.dto.js'
import { BrandService } from './brand.service.js'
import { IsPublic } from '../../shared/decorators/is-public-decorator.js'
import { ActiveUser } from '../../shared/decorators/active-user.decorator.js'
import { Roles } from '../../shared/decorators/roles.decorator.js'
import { RoleName } from '../../shared/constants/role.constant.js'

// Mọi route trong class này đều bắt đầu bằng /languages
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}
  @IsPublic()
  @Get()
  @ZodResponse({ type: GetBrandResDTO })
  findAll() {
    return this.brandService.findAll()
  }
  @IsPublic()
  @Get(':brandId')
  @ZodResponse({ type: GetBrandDetailDTO })
  findById(@Param() params: GetBrandParamsDTO) {
    return this.brandService.findById(params.brandId)
  }

  @Roles(RoleName.Admin)
  @Post()
  @ZodResponse({ type: GetBrandDetailDTO })
  create(@Body() body: CreateBrandBodyDTO, @ActiveUser('userId') userId: number) {
    return this.brandService.create({ data: body, createdById: userId })
  }

  @Roles(RoleName.Admin)
  @Put(':brandId')
  @ZodResponse({ type: GetBrandDetailDTO })
  update(@Param() params: GetBrandParamsDTO, @Body() body: UpdateBrandBodyDTO, @ActiveUser('userId') userId: number) {
    return this.brandService.update({ id: params.brandId, data: body, updatedById: userId })
  }

  @Roles(RoleName.Admin)
  // Delete
  @Delete(':brandId')
  @ZodResponse({ type: MessageResDTO })
  delete(@Param() params: GetBrandParamsDTO, @ActiveUser('userId') userId: number) {
    return this.brandService.delete({ id: params.brandId, deletedById: userId })
  }
}
