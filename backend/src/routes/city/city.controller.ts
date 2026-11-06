import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { CityService } from './city.service.js'
import { ZodResponse } from 'nestjs-zod'
import {
  CreateCityBodyDTO,
  GetCityBySlugDTO,
  GetCityDetailResDTO,
  GetCityParamsDTO,
  GetCityResDTO,
  UpdateCityBodyDTO,
} from './city.dto.js'
import { IsPublic } from '../../shared/decorators/is-public-decorator.js'
import { ActiveUser } from '../../shared/decorators/active-user.decorator.js'
import { RoleName } from '../../shared/constants/role.constant.js'
import { Roles } from '../../shared/decorators/roles.decorator.js'
import { MessageResDTO } from '../../shared/dtos/response.dto.js'

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  // Get  /cities
  @IsPublic()
  @Get()
  @ZodResponse({ type: GetCityResDTO })
  findAll() {
    return this.cityService.findAll()
  }

  @IsPublic()
  @Get(':cityId')
  @ZodResponse({ type: GetCityDetailResDTO })
  findById(@Param() param: GetCityParamsDTO) {
    return this.cityService.findById(param.cityId)
  }

  // GET /cities/slug/da-lat
  @IsPublic()
  @Get('slug/:slug')
  @ZodResponse({ type: GetCityDetailResDTO })
  findBySlug(@Param() param: GetCityBySlugDTO) {
    return this.cityService.findBySlug(param.slug)
  }

  @Roles(RoleName.Admin)
  @Post()
  @ZodResponse({ type: GetCityDetailResDTO })
  create(@Body() body: CreateCityBodyDTO, @ActiveUser('userId') userId: number) {
    return this.cityService.create({ data: body, createdById: userId })
  }

  @Roles(RoleName.Admin)
  @Put(':cityId')
  @ZodResponse({ type: GetCityDetailResDTO })
  update(@Body() body: UpdateCityBodyDTO, @Param() param: GetCityParamsDTO, @ActiveUser('userId') userId: number) {
    return this.cityService.update({ id: param.cityId, data: body, updatedById: userId })
  }

  @Roles(RoleName.Admin)
  @Delete(':cityId')
  @ZodResponse({ type: MessageResDTO })
  delete(@Param() param: GetCityParamsDTO, @ActiveUser('userId') userId: number) {
    return this.cityService.delete({ id: param.cityId, deletedById: userId })
  }
}
