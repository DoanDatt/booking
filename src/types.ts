/* eslint-disable @typescript-eslint/no-namespace */

// Khai báo kiểu cho các cột Json trong schema (comment /// [Tên] phía trên cột).
// prisma-json-types-generator sẽ dùng các kiểu này thay cho kiểu Json chung chung.
// TODO: khi làm tới module product, thay bằng type suy ra từ Zod schema như dự án mẫu.
declare global {
  namespace PrismaJson {
    type Variants = {
      value: string
      options: string[]
    }[]
    type ProductTranslations = {
      id: number
      name: string
      description: string
      languageId: string
    }[]
    type Receiver = {
      name: string
      phone: string
      address: string
    }
  }
}

export {}
