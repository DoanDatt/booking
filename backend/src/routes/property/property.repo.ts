import { Injectable } from '@nestjs/common'
import { Prisma } from '../../generated/prisma/client.js'
import { PropertyStatus } from '../../generated/prisma/enums.js'
import { PrismaService } from '../../shared/services/prisma.service.js'
import {
  CreatePropertyBodyType,
  GetManagePropertiesQueryType,
  GetPropertiesQueryType,
  UpdatePropertyBodyType,
} from './property.model.js'

// Chỉ lấy vài cột của bảng liên quan (xem select trong include)
const citySummarySelect = { select: { id: true, name: true, slug: true } } as const
const amenitySummarySelect = {
  where: { deletedAt: null },
  select: { id: true, name: true, icon: true },
  orderBy: { name: 'asc' },
} as const
const activeRoomTypesInclude = {
  where: { deletedAt: null },
  omit: { deletedAt: true },
  orderBy: { pricePerNight: 'asc' },
} as const

@Injectable()
export class PropertyRepo {
  constructor(private readonly prismaService: PrismaService) {}

  // Danh sách công khai: chỉ chỗ ở đã duyệt
  async findManyPublic({ page, limit, cityId, citySlug, type, search }: GetPropertiesQueryType) {
    const where: Prisma.PropertyWhereInput = {
      deletedAt: null,
      status: PropertyStatus.APPROVED,
      cityId,
      type,
      city: citySlug ? { slug: citySlug, deletedAt: null } : undefined,
      name: search ? { contains: search, mode: 'insensitive' } : undefined,
    }
    // $transaction: đếm và lấy trang dữ liệu trong cùng 1 lần, số liệu khớp nhau
    const [totalItems, data] = await this.prismaService.$transaction([
      this.prismaService.property.count({ where }),
      this.prismaService.property.findMany({
        where,
        include: {
          city: citySummarySelect,
          // Chỉ cần loại phòng rẻ nhất để hiện "Giá từ ..."
          roomTypes: { where: { deletedAt: null }, select: { pricePerNight: true }, orderBy: { pricePerNight: 'asc' }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])
    return { totalItems, data }
  }

  findPublicDetail(id: number) {
    return this.prismaService.property.findFirst({
      where: { id, deletedAt: null, status: PropertyStatus.APPROVED },
      include: {
        city: citySummarySelect,
        amenities: amenitySummarySelect,
        roomTypes: activeRoomTypesInclude,
      },
    })
  }

  // ownerId = undefined → ADMIN thấy tất cả
  async findManyForManage({ page, limit, status, ownerId }: GetManagePropertiesQueryType & { ownerId?: number }) {
    const where: Prisma.PropertyWhereInput = { deletedAt: null, status, ownerId }
    const [totalItems, data] = await this.prismaService.$transaction([
      this.prismaService.property.count({ where }),
      this.prismaService.property.findMany({
        where,
        include: { city: citySummarySelect },
        omit: { deletedAt: true },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])
    return { totalItems, data }
  }

  findManageDetail(id: number) {
    return this.prismaService.property.findFirst({
      where: { id, deletedAt: null },
      omit: { deletedAt: true },
      include: {
        city: citySummarySelect,
        amenities: amenitySummarySelect,
        roomTypes: activeRoomTypesInclude,
      },
    })
  }

  // Dùng để kiểm tra quyền sở hữu: chỉ cần id + ownerId
  findOwner(id: number) {
    return this.prismaService.property.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, ownerId: true },
    })
  }

  findActiveCity(cityId: number) {
    return this.prismaService.city.findFirst({ where: { id: cityId, deletedAt: null }, select: { id: true } })
  }

  countActiveAmenities(ids: number[]) {
    return this.prismaService.amenity.count({ where: { id: { in: ids }, deletedAt: null } })
  }

  create({ ownerId, data: { amenityIds, ...data } }: { ownerId: number; data: CreatePropertyBodyType }) {
    return this.prismaService.property.create({
      data: {
        ...data,
        ownerId,
        // n-n: nối Property với các Amenity đã có
        amenities: { connect: amenityIds.map((id) => ({ id })) },
      },
      select: { id: true },
    })
  }

  // resetStatus = true khi SELLER sửa: phải chờ ADMIN duyệt lại
  update({
    id,
    data: { amenityIds, ...data },
    resetStatus,
  }: {
    id: number
    data: UpdatePropertyBodyType
    resetStatus: boolean
  }) {
    return this.prismaService.property.update({
      where: { id, deletedAt: null },
      data: {
        ...data,
        // set: thay toàn bộ danh sách tiện nghi bằng danh sách mới
        amenities: { set: amenityIds.map((id) => ({ id })) },
        ...(resetStatus ? { status: PropertyStatus.PENDING, rejectReason: null } : {}),
      },
      select: { id: true },
    })
  }

  updateStatus({ id, status, rejectReason }: { id: number; status: PropertyStatus; rejectReason: string | null }) {
    return this.prismaService.property.update({
      where: { id, deletedAt: null },
      data: { status, rejectReason },
      select: { id: true },
    })
  }

  delete(id: number) {
    return this.prismaService.property.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
      select: { id: true },
    })
  }
}
