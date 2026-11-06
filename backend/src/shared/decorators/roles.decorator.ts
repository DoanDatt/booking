import { RoleName } from '../constants/role.constant.js'
import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'roles'

// ADMIN | CLIENT | SELLER -> lấy từ chính object RoleName
export type RoleNameType = (typeof RoleName)[keyof typeof RoleName]

// @Roles(RoleName.Admin) hoặc @Roles(RoleName.Admin, RoleName.Seller)
export const Roles = (...roles: RoleNameType[]) => SetMetadata(ROLES_KEY, roles)
