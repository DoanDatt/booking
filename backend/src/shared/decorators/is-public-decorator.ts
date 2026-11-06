import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'

// Dán nhãn isPublic = true lên route hoặc controller → guard bỏ qua kiểm tra token
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true)
