import z from 'zod'
import { UserSchema } from '../../shared/models/shared-user.model.js'

export const RegisterBodySchema = UserSchema.pick({
  email: true,
  password: true,
  name: true,
  phoneNumber: true,
})
  .extend({
    confirmPassword: z.string().min(6).max(100),
  })
  .strict()
  // superRefine: kiểm tra liên quan tới nhiều field cùng lúc
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: `Error.PasswordNotMatch`,
        path: ['confirmPassword'], // Lỗi hiện dưới ô confirmPassword
      })
    }
  })
// Response: bỏ những field bí mật
export const RegisterResSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
})

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>
export type RegisterResType = z.infer<typeof RegisterResSchema>

export const LoginBodySchema = UserSchema.pick({
  email: true,
  password: true,
}).strict()

export const LoginResSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

export type LoginBodyType = z.infer<typeof LoginBodySchema>
export type LoginResType = z.infer<typeof LoginResSchema>

export const RefreshTokenBodySchema = z
  .object({
    refreshToken: z.string(),
  })
  .strict()

export const RefreshTokenResSchema = LoginResSchema // cũng trả { accessToken, refreshToken }
export const LogoutBodySchema = RefreshTokenBodySchema // logout cũng gửi { refreshToken }

export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>
export type LogoutBodyType = RefreshTokenBodyType
