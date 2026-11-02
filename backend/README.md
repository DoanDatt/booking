# Ecom — Backend

Backend sàn thương mại điện tử kiểu Shopee (Khách hàng · Người bán · Admin).

NestJS 12 · Prisma 7 · PostgreSQL 17 (Docker) · Zod (nestjs-zod)

Thiết kế database và quy ước code dựa theo dự án mẫu `Nestjs-Super/ecom`.

## Chạy lần đầu

```bash
npm install            # tự chạy `prisma generate`
cp .env.example .env
npm run db:up          # bật PostgreSQL ở cổng 5434
npm run db:migrate     # tạo bảng
npm run start:dev
```

- Health check: <http://localhost:3000/health>
- Swagger UI: <http://localhost:3000/api>

## Scripts

| Lệnh | Mô tả |
| --- | --- |
| `npm run start:dev` | Chạy dev, tự reload khi sửa code |
| `npm run db:migrate` | Tạo + áp migration sau khi sửa `prisma/schema.prisma` |
| `npm run db:generate` | Sinh lại Prisma Client |
| `npm run db:studio` | Giao diện web xem/sửa dữ liệu |
| `npm run test:e2e` | Test end-to-end |

## Cấu trúc

```text
prisma/schema.prisma          # Định nghĩa bảng
src/main.ts                   # Khởi động app: CORS, helmet, Swagger
src/app.module.ts             # Module gốc, đăng ký global pipe/interceptor/filter
src/routes/<feature>/         # Mỗi feature gồm:
  <feature>.model.ts          #   Zod schema + type (nguồn sự thật cho validate & response)
  <feature>.dto.ts            #   DTO class sinh từ schema (createZodDto)
  <feature>.error.ts          #   Các exception riêng của feature
  <feature>.repo.ts           #   Truy vấn DB (chỉ nơi này gọi Prisma)
  <feature>.service.ts        #   Logic nghiệp vụ, bắt lỗi Prisma -> exception
  <feature>.controller.ts     #   Định nghĩa route
  <feature>.module.ts
src/shared/                   # Dùng chung toàn app
  config.ts                   #   Đọc + validate .env bằng Zod
  services/                   #   PrismaService, ...
  pipes/ interceptor/ filters/
  models/ dtos/               #   Schema/DTO dùng chung (phân trang, message, ngày giờ)
  helpers.ts error.ts
src/generated/prisma/         # Prisma Client sinh tự động (không sửa tay, không commit)
```

## Quy ước

- Response thành công luôn có dạng `{ data, statusCode }`
- Lỗi validate trả về `422` dạng `[{ message, path }]`
- Xoá mềm bằng `deletedAt`; truy vấn luôn lọc `deletedAt: null`
- Unique trên bảng có xoá mềm dùng Partial Unique Index (`WHERE "deletedAt" IS NULL`), viết tay trong migration
- Kiểu cho các cột `Json` khai báo trong `src/types.ts` (prisma-json-types-generator)
- Code style: Prettier không dấu chấm phẩy, nháy đơn, `printWidth: 120`
