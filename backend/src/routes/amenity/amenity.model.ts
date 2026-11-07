import { z } from 'zod'
import { DateTimeSchema } from '../../shared/models/date-time.model.js'

export const AmenitySchema = z.object({
  id: z.number(),
  name: z.string().trim().min(1).max(200),
  // Tên icon FE dùng, VD "wifi", "pool". DB mặc định "" (không null)
  icon: z.string().max(100),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  deletedAt: DateTimeSchema.nullable(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
})

export const GetAmenitiesResSchema = z.object({
  data: z.array(AmenitySchema),
  totalItems: z.number(),
})

export const GetAmenityParamsSchema = z
  .object({
    amenityId: z.coerce.number().int().positive(),
  })
  .strict()

export const GetAmenityDetailResSchema = AmenitySchema

export const CreateAmenityBodySchema = AmenitySchema.pick({
  name: true,
  icon: true,
})
  .partial({ icon: true }) // không gửi icon → DB dùng mặc định ""
  .strict()

export const UpdateAmenityBodySchema = CreateAmenityBodySchema

export type AmenityType = z.infer<typeof AmenitySchema>
export type GetAmenitiesResType = z.infer<typeof GetAmenitiesResSchema>
export type GetAmenityParamsType = z.infer<typeof GetAmenityParamsSchema>
export type GetAmenityDetailResType = z.infer<typeof GetAmenityDetailResSchema>
export type CreateAmenityBodyType = z.infer<typeof CreateAmenityBodySchema>
export type UpdateAmenityBodyType = z.infer<typeof UpdateAmenityBodySchema>
