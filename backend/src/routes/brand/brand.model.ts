import z from 'zod'
import { DateTimeSchema } from '../../shared/models/date-time.model.js'

export const BrandSchema = z.object({
  id: z.number(),
  logo: z.string().max(1000),
  name: z.string().max(500),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  deletedAt: DateTimeSchema.nullable(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
})

export const GetBrandsResSchema = z.object({
  data: z.array(BrandSchema),
  totalItems: z.number(),
})

export const GetBrandParamsSchema = z.object({
  brandId: z.coerce.number().int().positive(),
})

export const GetBrandDetailResSchema = BrandSchema

export const CreateBrandBodySchema = BrandSchema.pick({
  name: true,
  logo: true,
}).strict()

export const UpdateBrandBodySchema = BrandSchema.pick({
  name: true,
  logo: true,
}).strict()

export type BrandType = z.infer<typeof BrandSchema>
export type GetBrandsResType = z.infer<typeof GetBrandsResSchema>
export type GetBrandParamsType = z.infer<typeof GetBrandParamsSchema>
export type GetBrandDetailResType = z.infer<typeof GetBrandDetailResSchema>
export type CreateBrandBodyType = z.infer<typeof CreateBrandBodySchema>
export type UpdateBrandBodyType = z.infer<typeof UpdateBrandBodySchema>
