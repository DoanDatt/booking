# Ecom Fullstack

Dự án thương mại điện tử fullstack.

| Thư mục | Công nghệ | Trạng thái |
|---|---|---|
| [backend/](backend/) | NestJS 12, Prisma 7, PostgreSQL, Zod | Đang làm |
| frontend/ | Chưa chọn | Chưa bắt đầu |

## Chạy backend

```bash
cd backend
cp .env.example .env
npm install
npm run db:up        # bật PostgreSQL bằng Docker (cổng 5434)
npm run db:migrate
npm run start:dev    # Swagger: http://localhost:4000/api
```
