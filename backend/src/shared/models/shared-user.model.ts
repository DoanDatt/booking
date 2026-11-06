import z from 'zod'
import { UserStatus } from '../../generated/prisma/enums.js'
import { DateTimeSchema } from './date-time.model.js'

export const UserSchema = z.object({
  id: z.number(),
  email: z.email(),
  name: z.string().min(1).max(100),
  password: z.string().min(6).max(15),
  phoneNumber: z.string().min(9).max(100),
  avatar: z.string().nullable(),
  totpSecret: z.string().nullable(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED]),
  roleId: z.number(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  deletedAt: DateTimeSchema.nullable(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
})
export type UserType = z.infer<typeof UserSchema>

// Dùng cho GET /profile ̣sau này cả GET /users/:id của admin

export const GetUserProfileResSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
}).extend({
  role: z.object({
    id: z.number(),
    name: z.string(),
  }),
})
export type GetUserProfileResType = z.infer<typeof GetUserProfileResSchema>
