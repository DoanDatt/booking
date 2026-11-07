import { Injectable } from '@nestjs/common'
import { PropertyStatus } from '../../generated/prisma/enums.js'
import { RoleName } from '../../shared/constants/role.constant.js'
import { NotFoundRecordException } from '../../shared/error.js'
import { isNotFoundPrismaError } from '../../shared/helpers.js'
import { AccessTokenPayload } from '../../shared/types/jwt.type.js'
import { AmenityNotFoundException, CityNotFoundException, NotPropertyOwnerException } from './property.error.js'
import {
  CreatePropertyBodyType,
  GetManagePropertiesQueryType,
  GetPropertiesQueryType,
  UpdatePropertyBodyType,
  UpdatePropertyStatusBodyType,
} from './property.model.js'
import { PropertyRepo } from './property.repo.js'

const toPage = <T>({ data, totalItems }: { data: T[]; totalItems: number }, page: number, limit: number) => ({
  data,
  totalItems,
  page,
  limit,
  totalPages: Math.ceil(totalItems / limit),
})

@Injectable()
export class PropertyService {
  constructor(private readonly propertyRepo: PropertyRepo) {}

  // ----- Công khai -----

  async findManyPublic(query: GetPropertiesQueryType) {
    const result = await this.propertyRepo.findManyPublic(query)
    // roomTypes chỉ có 1 phần tử (loại phòng rẻ nhất) → đổi thành minPrice
    const data = result.data.map(({ roomTypes, ...property }) => ({
      ...property,
      minPrice: roomTypes[0]?.pricePerNight ?? null,
    }))
    return toPage({ data, totalItems: result.totalItems }, query.page, query.limit)
  }

  async findPublicDetail(id: number) {
    const property = await this.propertyRepo.findPublicDetail(id)
    // Chưa duyệt / bị từ chối / đã xóa đều trả 404 → khách không biết chỗ ở đó tồn tại
    if (!property) {
      throw NotFoundRecordException()
    }
    return property
  }

  // ----- Quản lý -----

  /**
   * Kiểm tra quyền quản lý một chỗ ở: ADMIN quản lý được tất cả, SELLER chỉ chỗ ở của mình.
   * Không tồn tại → 404, không phải chủ → 403.
   * Export qua PropertyModule để RoomType dùng lại.
   */
  async assertCanManage(propertyId: number, user: AccessTokenPayload) {
    const property = await this.propertyRepo.findOwner(propertyId)
    if (!property) {
      throw NotFoundRecordException()
    }
    if (user.roleName !== RoleName.Admin && property.ownerId !== user.userId) {
      throw NotPropertyOwnerException()
    }
    return property
  }

  async findManyForManage(query: GetManagePropertiesQueryType, user: AccessTokenPayload) {
    const ownerId = user.roleName === RoleName.Admin ? undefined : user.userId
    const result = await this.propertyRepo.findManyForManage({ ...query, ownerId })
    return toPage(result, query.page, query.limit)
  }

  async findManageDetail(id: number, user: AccessTokenPayload) {
    await this.assertCanManage(id, user)
    const property = await this.propertyRepo.findManageDetail(id)
    if (!property) {
      throw NotFoundRecordException()
    }
    return property
  }

  async create(data: CreatePropertyBodyType, user: AccessTokenPayload) {
    const amenityIds = await this.validateRelations(data)
    const { id } = await this.propertyRepo.create({ ownerId: user.userId, data: { ...data, amenityIds } })
    return this.findManageDetail(id, user)
  }

  async update(id: number, data: UpdatePropertyBodyType, user: AccessTokenPayload) {
    await this.assertCanManage(id, user)
    const amenityIds = await this.validateRelations(data)
    try {
      await this.propertyRepo.update({
        id,
        data: { ...data, amenityIds },
        // SELLER sửa → chờ duyệt lại; ADMIN sửa thì giữ nguyên trạng thái
        resetStatus: user.roleName !== RoleName.Admin,
      })
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException()
      }
      throw error
    }
    return this.findManageDetail(id, user)
  }

  async updateStatus(id: number, { status, rejectReason }: UpdatePropertyStatusBodyType, user: AccessTokenPayload) {
    try {
      await this.propertyRepo.updateStatus({
        id,
        status,
        // Duyệt thì xóa lý do từ chối cũ
        rejectReason: status === PropertyStatus.REJECTED ? (rejectReason ?? null) : null,
      })
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException()
      }
      throw error
    }
    return this.findManageDetail(id, user)
  }

  async delete(id: number, user: AccessTokenPayload) {
    await this.assertCanManage(id, user)
    try {
      await this.propertyRepo.delete(id)
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException()
      }
      throw error
    }
    return { message: 'Delete Successfully' }
  }

  // City phải còn tồn tại; mọi amenityId phải là tiện nghi còn tồn tại. Trả về amenityIds đã bỏ trùng
  private async validateRelations({ cityId, amenityIds }: { cityId: number; amenityIds: number[] }) {
    const city = await this.propertyRepo.findActiveCity(cityId)
    if (!city) {
      throw CityNotFoundException()
    }
    const uniqueAmenityIds = [...new Set(amenityIds)]
    if (uniqueAmenityIds.length > 0) {
      const count = await this.propertyRepo.countActiveAmenities(uniqueAmenityIds)
      if (count !== uniqueAmenityIds.length) {
        throw AmenityNotFoundException()
      }
    }
    return uniqueAmenityIds
  }
}
