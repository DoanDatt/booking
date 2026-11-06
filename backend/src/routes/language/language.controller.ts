import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { LanguageService } from './language.service.js'
import { ZodResponse } from 'nestjs-zod'
import {
  CreateLanguageBodyDTO,
  GetLanguageDetailResDTO,
  GetLanguageParamsDTO,
  GetLanguagesResDTO,
  UpdateLanguageBodyDTO,
} from './language.dto.js'
import { MessageResDTO } from '../../shared/dtos/response.dto.js'
import { IsPublic } from '../../shared/decorators/is-public-decorator.js'
import { ActiveUser } from '../../shared/decorators/active-user.decorator.js'
import { Roles } from '../../shared/decorators/roles.decorator.js'
import { RoleName } from '../../shared/constants/role.constant.js'

// Mọi route trong class này đều bắt đầu bằng /languages
@Controller('languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  // Get /languages
  @IsPublic()
  @Get()
  @ZodResponse({ type: GetLanguagesResDTO })
  findAll() {
    return this.languageService.findAll()
  }
  // Get /languages/vi
  @IsPublic()
  @Get(':languageId')
  @ZodResponse({ type: GetLanguageDetailResDTO })
  findById(@Param() params: GetLanguageParamsDTO) {
    return this.languageService.findById(params.languageId)
  }

  @Roles(RoleName.Admin)
  // Post /languages
  @Post()
  @ZodResponse({ type: GetLanguageDetailResDTO })
  create(@Body() body: CreateLanguageBodyDTO, @ActiveUser('userId') userId: number) {
    return this.languageService.create({ data: body, createdById: userId })
  }

  @Roles(RoleName.Admin)
  // Put /languages/vi
  @Put(':languageId')
  @ZodResponse({ type: GetLanguageDetailResDTO })
  update(
    @Param() params: GetLanguageParamsDTO,
    @Body() body: UpdateLanguageBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.languageService.update({ id: params.languageId, data: body, updatedById: userId })
  }

  @Roles(RoleName.Admin)
  // Delete
  @Delete(':languageId')
  @ZodResponse({ type: MessageResDTO })
  delete(@Param() params: GetLanguageParamsDTO, @ActiveUser('userId') userId: number) {
    return this.languageService.delete({ id: params.languageId, deletedById: userId })
  }
}
