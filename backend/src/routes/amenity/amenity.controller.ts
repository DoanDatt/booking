import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import { RoleName } from '../../shared/constants/role.constant.js'
import { ActiveUser } from '../../shared/decorators/active-user.decorator.js'
import { IsPublic } from '../../shared/decorators/is-public-decorator.js'
import { Roles } from '../../shared/decorators/roles.decorator.js'
import { MessageResDTO } from '../../shared/dtos/response.dto.js'
import {
  CreateAmenityBodyDTO,
  GetAmenitiesResDTO,
  GetAmenityDetailResDTO,
  GetAmenityParamsDTO,
  UpdateAmenityBodyDTO,
} from './amenity.dto.js'
import { AmenityService } from './amenity.service.js'

@Controller('amenities')
export class AmenityController {
  constructor(private readonly amenityService: AmenityService) {}

  // GET /amenities
  @IsPublic()
  @Get()
  @ZodResponse({ type: GetAmenitiesResDTO })
  findAll() {
    return this.amenityService.findAll()
  }

  // GET /amenities/1
  @IsPublic()
  @Get(':amenityId')
  @ZodResponse({ type: GetAmenityDetailResDTO })
  findById(@Param() params: GetAmenityParamsDTO) {
    return this.amenityService.findById(params.amenityId)
  }

  // POST /amenities
  @Roles(RoleName.Admin)
  @Post()
  @ZodResponse({ type: GetAmenityDetailResDTO })
  create(@Body() body: CreateAmenityBodyDTO, @ActiveUser('userId') userId: number) {
    return this.amenityService.create({ data: body, createdById: userId })
  }

  // PUT /amenities/1
  @Roles(RoleName.Admin)
  @Put(':amenityId')
  @ZodResponse({ type: GetAmenityDetailResDTO })
  update(@Param() params: GetAmenityParamsDTO, @Body() body: UpdateAmenityBodyDTO, @ActiveUser('userId') userId: number) {
    return this.amenityService.update({ id: params.amenityId, data: body, updatedById: userId })
  }

  // DELETE /amenities/1
  @Roles(RoleName.Admin)
  @Delete(':amenityId')
  @ZodResponse({ type: MessageResDTO })
  delete(@Param() params: GetAmenityParamsDTO, @ActiveUser('userId') userId: number) {
    return this.amenityService.delete({ id: params.amenityId, deletedById: userId })
  }
}
