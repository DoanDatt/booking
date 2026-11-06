# Booking Fullstack

Web đặt phòng khách sạn / homestay fullstack (khách tìm và đặt phòng, chủ chỗ ở quản lý phòng, admin duyệt).

| Thư mục | Công nghệ | Trạng thái |
|---|---|---|
| [backend/](backend/) | NestJS 12, Prisma 7, PostgreSQL, Zod | Đang làm |
| frontend/ | Next.js (dự kiến) | Chưa bắt đầu |

Thiết kế schema: [docs/thiet-ke-dat-phong.md](docs/thiet-ke-dat-phong.md) · Ghi chú khái niệm: [docs/khai-niem-backend.md](docs/khai-niem-backend.md)

## Chạy backend

```bash
cd backend
cp .env.example .env
npm install
npm run db:up           # bật PostgreSQL bằng Docker (cổng 5434)
npm run db:migrate
npm run init-seed-data  # tạo 3 role (ADMIN, CLIENT, SELLER) và tài khoản admin
npm run start:dev       # Swagger: http://localhost:4000/api
```
