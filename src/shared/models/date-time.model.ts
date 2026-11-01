import { z } from 'zod'

// Date trong code <-> chuỗi ISO trong JSON
export const DateTimeSchema = z.codec(z.iso.datetime(), z.date(), {
  decode: (value) => new Date(value),
  encode: (value) => value.toISOString(),
})
