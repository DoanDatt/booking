import { z } from 'zod'
import { DateTimeSchema } from '../../shared/models/date-time.model.js'

export const RoomTypeSchema = z.object({
  id: z.number(),
  propertyId: z.number(),
  name: z.string().trim().min(1).max(500), // "Deluxe giường đôi"
  description: z.string().max(5000),
  pricePerNight: z.number().int().positive().max(1_000_000_000), // VND
  maxGuests: z.number().int().min(1).max(50), // số khách tối đa / phòng
  totalRooms: z.number().int().min(1).max(1000), // có bao nhiêu phòng loại này
  bedType: z.string().max(200),
  sizeM2: z.number().int().positive().max(10_000).nullable(),
  images: z.array(z.url().max(1000)).max(20),
  deletedAt: DateTimeSchema.nullable(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
})

export const GetRoomTypesResSchema = z.object({
  data: z.array(RoomTypeSchema),
  totalItems: z.number(),
})

export const GetPropertyRoomTypesParamsSchema = z
  .object({
    propertyId: z.coerce.number().int().positive(),
  })
  .strict()

export const GetRoomTypeParamsSchema = GetPropertyRoomTypesParamsSchema.extend({
  roomTypeId: z.coerce.number().int().positive(),
}).strict()

export const GetRoomTypeDetailResSchema = RoomTypeSchema

export const CreateRoomTypeBodySchema = RoomTypeSchema.pick({
  name: true,
  description: true,
  pricePerNight: true,
  maxGuests: true,
  totalRooms: true,
  bedType: true,
  sizeM2: true,
  images: true,
})
  // Không gửi thì DB dùng mặc định: description/bedType = "", sizeM2 = null, images = []
  .partial({ description: true, bedType: true, sizeM2: true, images: true })
  .strict()

export const UpdateRoomTypeBodySchema = CreateRoomTypeBodySchema

export type RoomTypeType = z.infer<typeof RoomTypeSchema>
export type GetRoomTypesResType = z.infer<typeof GetRoomTypesResSchema>
export type GetPropertyRoomTypesParamsType = z.infer<typeof GetPropertyRoomTypesParamsSchema>
export type GetRoomTypeParamsType = z.infer<typeof GetRoomTypeParamsSchema>
export type GetRoomTypeDetailResType = z.infer<typeof GetRoomTypeDetailResSchema>
export type CreateRoomTypeBodyType = z.infer<typeof CreateRoomTypeBodySchema>
export type UpdateRoomTypeBodyType = z.infer<typeof UpdateRoomTypeBodySchema>
