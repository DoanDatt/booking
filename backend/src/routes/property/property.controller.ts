import { Controller, Get, Param, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import { IsPublic } from '../../shared/decorators/is-public-decorator.js'
import { GetPropertiesQueryDTO, GetPropertiesResDTO, GetPropertyDetailResDTO, GetPropertyParamsDTO } from './property.dto.js'
import { PropertyService } from './property.service.js'

// Trang công khai cho khách: chỉ thấy chỗ ở đã duyệt
@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  // GET /properties?page=1&limit=10&citySlug=da-lat&type=HOTEL&search=hoa
  @IsPublic()
  @Get()
  @ZodResponse({ type: GetPropertiesResDTO })
  findMany(@Query() query: GetPropertiesQueryDTO) {
    return this.propertyService.findManyPublic(query)
  }

  // GET /properties/1
  @IsPublic()
  @Get(':propertyId')
  @ZodResponse({ type: GetPropertyDetailResDTO })
  findById(@Param() params: GetPropertyParamsDTO) {
    return this.propertyService.findPublicDetail(params.propertyId)
  }
}
