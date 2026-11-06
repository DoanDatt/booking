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

  @Post()
  @ZodResponse({ type: GetBrandDetailDTO })
  create(@Body() body: CreateBrandBodyDTO) {
    return this.brandService.create({ data: body, createdById: null })
  }

  @Put(':brandId')
  @ZodResponse({ type: GetBrandDetailDTO })
  update(@Param() params: GetBrandParamsDTO, @Body() body: UpdateBrandBodyDTO) {
    return this.brandService.update({ id: params.brandId, data: body, updatedById: null })
  }

  // Delete
  @Delete(':brandId')
  @ZodResponse({ type: MessageResDTO })
  delete(@Param() params: GetBrandParamsDTO) {
    return this.brandService.delete({ id: params.brandId, deletedById: null })
  }
}
