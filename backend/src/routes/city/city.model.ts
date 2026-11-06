import z from 'zod'
import { DateTimeSchema } from '../../shared/models/date-time.model.js'

export const CitySchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(200),
  // slug: chỉ chữ thường, số, gạch nối. Không bắt đầu/kết thúc bằng gạch. VD: "da-lat", "ho-chi-minh"
  slug: z
    .string()
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Error.InvalidSlug'),
  imageUrl: z.url().max(1000).nullable(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  deletedAt: DateTimeSchema.nullable(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
})

export const GetCitiesResSchema = z.object({
  data: z.array(CitySchema),
  totalItems: z.number(),
})

export const GetCityParamsSchema = z
  .object({
    cityId: z.coerce.number().int().positive(),
  })
  .strict()

export const GetCityBySlugParamsSchema = CitySchema.pick({
  slug: true,
}).strict()

export const GetCityDetailResSchema = CitySchema

export const CreateCityBodySchema = CitySchema.pick({
  name: true,
  slug: true,
  imageUrl: true,
})
  .partial({ imageUrl: true }) // imageUrl không bắt buốc
  .strict()

export const UpdateCityBodySchema = CreateCityBodySchema

export type CityType = z.infer<typeof CitySchema>
export type GetCitiesResType = z.infer<typeof GetCitiesResSchema>
export type GetCityParamsType = z.infer<typeof GetCityParamsSchema>
export type GetCityBySlugParamsType = z.infer<typeof GetCityBySlugParamsSchema>
export type GetCityDetailResType = z.infer<typeof GetCityDetailResSchema>
export type CreateCityBodyType = z.infer<typeof CreateCityBodySchema>
export type UpdateCityBodyType = z.infer<typeof UpdateCityBodySchema>
