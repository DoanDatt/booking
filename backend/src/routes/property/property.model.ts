import { z } from 'zod'
import { PropertyStatus, PropertyType } from '../../generated/prisma/enums.js'
import { DateTimeSchema } from '../../shared/models/date-time.model.js'
import { RoomTypeSchema } from '../room-type/room-type.model.js'

// "14:00", "09:30" (giờ 00–23, phút 00–59)
const TimeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Error.InvalidTime')

export const PropertySchema = z.object({
  id: z.number(),
  name: z.string().trim().min(1).max(500),
  type: z.enum(PropertyType),
  description: z.string().max(5000),
  address: z.string().trim().min(1).max(500),
  starRating: z.number().int().min(1).max(5).nullable(), // homestay có thể không xếp hạng sao
  images: z.array(z.url().max(1000)).max(20),
  checkInTime: TimeSchema,
  checkOutTime: TimeSchema,
  status: z.enum(PropertyStatus),
  rejectReason: z.string().max(1000).nullable(),
  ownerId: z.number(),
  cityId: z.number(),
  deletedAt: DateTimeSchema.nullable(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
})

// Thông tin rút gọn của bảng liên quan, trả kèm Property
const CitySummarySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
})

const AmenitySummarySchema = z.object({
  id: z.number(),
  name: z.string(),
  icon: z.string(),
})

const PublicRoomTypeSchema = RoomTypeSchema.omit({ deletedAt: true })

// ----- Phân trang -----

const PageQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
})

const pageResSchema = <T extends z.ZodType>(item: T) =>
  z.object({
    data: z.array(item),
    totalItems: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  })

// ----- Công khai: /properties -----

export const GetPropertiesQuerySchema = PageQuerySchema.extend({
  cityId: z.coerce.number().int().positive().optional(),
  citySlug: z.string().max(200).optional(),
  type: z.enum(PropertyType).optional(),
  search: z.string().trim().min(1).max(100).optional(), // tìm theo tên chỗ ở
}).strict()

export const PropertyListItemSchema = PropertySchema.pick({
  id: true,
  name: true,
  type: true,
  address: true,
  starRating: true,
  images: true,
  cityId: true,
}).extend({
  city: CitySummarySchema,
  minPrice: z.number().nullable(), // giá/đêm thấp nhất trong các loại phòng; null khi chưa có loại phòng
})

export const GetPropertiesResSchema = pageResSchema(PropertyListItemSchema)

export const GetPropertyParamsSchema = z
  .object({
    propertyId: z.coerce.number().int().positive(),
  })
  .strict()

export const GetPropertyDetailResSchema = PropertySchema.omit({
  status: true,
  rejectReason: true,
  deletedAt: true,
}).extend({
  city: CitySummarySchema,
  amenities: z.array(AmenitySummarySchema),
  roomTypes: z.array(PublicRoomTypeSchema),
})

// ----- Quản lý: /manage/properties (SELLER, ADMIN) -----

export const GetManagePropertiesQuerySchema = PageQuerySchema.extend({
  status: z.enum(PropertyStatus).optional(),
}).strict()

export const ManagePropertyListItemSchema = PropertySchema.omit({ deletedAt: true }).extend({
  city: CitySummarySchema,
})

export const GetManagePropertiesResSchema = pageResSchema(ManagePropertyListItemSchema)

export const GetManagePropertyDetailResSchema = PropertySchema.omit({ deletedAt: true }).extend({
  city: CitySummarySchema,
  amenities: z.array(AmenitySummarySchema),
  roomTypes: z.array(PublicRoomTypeSchema),
})

export const CreatePropertyBodySchema = PropertySchema.pick({
  name: true,
  type: true,
  description: true,
  address: true,
  starRating: true,
  images: true,
  checkInTime: true,
  checkOutTime: true,
  cityId: true,
})
  .partial({ description: true, starRating: true, images: true, checkInTime: true, checkOutTime: true })
  .extend({
    cityId: z.number().int().positive(),
    amenityIds: z.array(z.number().int().positive()).max(50).default([]), // danh sách id tiện nghi đã chọn
  })
  .strict()

export const UpdatePropertyBodySchema = CreatePropertyBodySchema

// ADMIN duyệt / từ chối. Từ chối thì bắt buộc có lý do để SELLER biết sửa gì
export const UpdatePropertyStatusBodySchema = z
  .object({
    status: z.enum([PropertyStatus.APPROVED, PropertyStatus.REJECTED]),
    rejectReason: z.string().trim().min(1).max(1000).optional(),
  })
  .strict()
  .superRefine(({ status, rejectReason }, ctx) => {
    if (status === PropertyStatus.REJECTED && !rejectReason) {
      ctx.addIssue({
        code: 'custom',
        message: 'Error.RejectReasonRequired',
        path: ['rejectReason'],
      })
    }
  })

// Không đặt tên PropertyType vì trùng với enum PropertyType của Prisma
export type PropertyEntityType = z.infer<typeof PropertySchema>
export type GetPropertiesQueryType = z.infer<typeof GetPropertiesQuerySchema>
export type GetPropertiesResType = z.infer<typeof GetPropertiesResSchema>
export type GetPropertyParamsType = z.infer<typeof GetPropertyParamsSchema>
export type GetPropertyDetailResType = z.infer<typeof GetPropertyDetailResSchema>
export type GetManagePropertiesQueryType = z.infer<typeof GetManagePropertiesQuerySchema>
export type GetManagePropertiesResType = z.infer<typeof GetManagePropertiesResSchema>
export type GetManagePropertyDetailResType = z.infer<typeof GetManagePropertyDetailResSchema>
export type CreatePropertyBodyType = z.infer<typeof CreatePropertyBodySchema>
export type UpdatePropertyBodyType = z.infer<typeof UpdatePropertyBodySchema>
export type UpdatePropertyStatusBodyType = z.infer<typeof UpdatePropertyStatusBodySchema>
