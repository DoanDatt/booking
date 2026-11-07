import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import { RoleName } from '../../shared/constants/role.constant.js'
import { ActiveUser } from '../../shared/decorators/active-user.decorator.js'
import { Roles } from '../../shared/decorators/roles.decorator.js'
import { MessageResDTO } from '../../shared/dtos/response.dto.js'
import type { AccessTokenPayload } from '../../shared/types/jwt.type.js'
import {
  CreateRoomTypeBodyDTO,
  GetPropertyRoomTypesParamsDTO,
  GetRoomTypeDetailResDTO,
  GetRoomTypeParamsDTO,
  GetRoomTypesResDTO,
  UpdateRoomTypeBodyDTO,
} from './room-type.dto.js'
import { RoomTypeService } from './room-type.service.js'

// Loại phòng luôn nằm dưới 1 chỗ ở. Khách xem loại phòng qua GET /properties/:propertyId
@Roles(RoleName.Admin, RoleName.Seller)
@Controller('manage/properties/:propertyId/room-types')
export class RoomTypeController {
  constructor(private readonly roomTypeService: RoomTypeService) {}

  // GET /manage/properties/1/room-types
  @Get()
  @ZodResponse({ type: GetRoomTypesResDTO })
  findMany(@Param() params: GetPropertyRoomTypesParamsDTO, @ActiveUser() user: AccessTokenPayload) {
    return this.roomTypeService.findManyByProperty(params.propertyId, user)
  }

  // POST /manage/properties/1/room-types
  @Post()
  @ZodResponse({ type: GetRoomTypeDetailResDTO })
  create(
    @Param() params: GetPropertyRoomTypesParamsDTO,
    @Body() body: CreateRoomTypeBodyDTO,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    return this.roomTypeService.create(params.propertyId, body, user)
  }

  // PUT /manage/properties/1/room-types/2
  @Put(':roomTypeId')
  @ZodResponse({ type: GetRoomTypeDetailResDTO })
  update(@Param() params: GetRoomTypeParamsDTO, @Body() body: UpdateRoomTypeBodyDTO, @ActiveUser() user: AccessTokenPayload) {
    return this.roomTypeService.update(params, body, user)
  }

  // DELETE /manage/properties/1/room-types/2
  @Delete(':roomTypeId')
  @ZodResponse({ type: MessageResDTO })
  delete(@Param() params: GetRoomTypeParamsDTO, @ActiveUser() user: AccessTokenPayload) {
    return this.roomTypeService.delete(params, user)
  }
}
