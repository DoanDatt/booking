import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import { RoleName } from '../../shared/constants/role.constant.js'
import { ActiveUser } from '../../shared/decorators/active-user.decorator.js'
import { Roles } from '../../shared/decorators/roles.decorator.js'
import { MessageResDTO } from '../../shared/dtos/response.dto.js'
import type { AccessTokenPayload } from '../../shared/types/jwt.type.js'
import {
  CreatePropertyBodyDTO,
  GetManagePropertiesQueryDTO,
  GetManagePropertiesResDTO,
  GetManagePropertyDetailResDTO,
  GetPropertyParamsDTO,
  UpdatePropertyBodyDTO,
  UpdatePropertyStatusBodyDTO,
} from './property.dto.js'
import { PropertyService } from './property.service.js'

// Trang quản lý: SELLER (chỗ ở của mình) và ADMIN (tất cả).
// Gắn @Roles lên cả class được vì controller này không có route công khai nào
@Roles(RoleName.Admin, RoleName.Seller)
@Controller('manage/properties')
export class ManagePropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  // GET /manage/properties?status=PENDING
  @Get()
  @ZodResponse({ type: GetManagePropertiesResDTO })
  findMany(@Query() query: GetManagePropertiesQueryDTO, @ActiveUser() user: AccessTokenPayload) {
    return this.propertyService.findManyForManage(query, user)
  }

  // GET /manage/properties/1
  @Get(':propertyId')
  @ZodResponse({ type: GetManagePropertyDetailResDTO })
  findById(@Param() params: GetPropertyParamsDTO, @ActiveUser() user: AccessTokenPayload) {
    return this.propertyService.findManageDetail(params.propertyId, user)
  }

  // POST /manage/properties
  @Post()
  @ZodResponse({ type: GetManagePropertyDetailResDTO })
  create(@Body() body: CreatePropertyBodyDTO, @ActiveUser() user: AccessTokenPayload) {
    return this.propertyService.create(body, user)
  }

  // PUT /manage/properties/1
  @Put(':propertyId')
  @ZodResponse({ type: GetManagePropertyDetailResDTO })
  update(@Param() params: GetPropertyParamsDTO, @Body() body: UpdatePropertyBodyDTO, @ActiveUser() user: AccessTokenPayload) {
    return this.propertyService.update(params.propertyId, body, user)
  }

  // DELETE /manage/properties/1
  @Delete(':propertyId')
  @ZodResponse({ type: MessageResDTO })
  delete(@Param() params: GetPropertyParamsDTO, @ActiveUser() user: AccessTokenPayload) {
    return this.propertyService.delete(params.propertyId, user)
  }

  // PATCH /manage/properties/1/status — chỉ ADMIN (ghi đè @Roles của class)
  @Roles(RoleName.Admin)
  @Patch(':propertyId/status')
  @ZodResponse({ type: GetManagePropertyDetailResDTO })
  updateStatus(
    @Param() params: GetPropertyParamsDTO,
    @Body() body: UpdatePropertyStatusBodyDTO,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    return this.propertyService.updateStatus(params.propertyId, body, user)
  }
}
