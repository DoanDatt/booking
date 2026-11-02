import { z } from 'zod'

export const HealthResSchema = z.object({
  status: z.literal('ok'),
  database: z.literal('up'),
})

export type HealthResType = z.infer<typeof HealthResSchema>
