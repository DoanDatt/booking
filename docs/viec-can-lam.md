# Việc cần làm

Cập nhật: 2026-11-06. Đánh dấu `[x]` khi xong.

## Đã xong

- [x] Nền tảng backend: Prisma, Zod, Swagger, interceptor, filter, CORS, config, cổng 4000
- [x] Language (CRUD)
- [x] Auth: seed role + admin, register, login, refresh-token (rotation), logout, AccessTokenGuard + `@IsPublic`, `@ActiveUser`, `@Roles` + RolesGuard, `GET /profile`
- [x] Chuyển hướng ecom → web đặt phòng: schema mới, reset migration ([thiết kế](thiet-ke-dat-phong.md))
- [x] Frontend: Next.js 16 + Tailwind 4, landing page (Hero, Services, Destinations, Book a trip, Logos, Subscribe, Footer)

---

## Giai đoạn 1 — Backend: dữ liệu chỗ ở (tự viết, Claude review)

### 1. City (điểm đến) ✅
- [x] model, dto, error, repo, service, controller, module, đăng ký trong AppModule
- [x] `GET /cities`, `GET /cities/:cityId`, `GET /cities/slug/:slug` (công khai)
- [x] `POST / PUT / DELETE /cities` (chỉ ADMIN), xóa mềm
- [x] Trùng slug → 422 `path: slug`
- [x] Test + commit

### 2. Amenity (tiện nghi) ⬅ tiếp theo
- [ ] CRUD `/amenities` (GET công khai, còn lại chỉ ADMIN), trùng `name` → 422
- [ ] Test + commit

### 3. Property (chỗ ở)
- [ ] SELLER tạo / sửa / xóa chỗ ở **của mình** (kiểm tra `ownerId === userId`, ADMIN thì được tất cả)
- [ ] Gắn Amenity (quan hệ n-n: `connect` / `set`)
- [ ] Duyệt: tạo mới → `PENDING`; ADMIN `APPROVED` / `REJECTED` (kèm `rejectReason`); SELLER sửa chỗ ở bị từ chối → về `PENDING`
- [ ] `GET /properties` (công khai, chỉ `APPROVED`): phân trang, lọc theo thành phố / loại, tìm theo tên
- [ ] `GET /properties/:id`: chi tiết kèm City, Amenity, RoomType
- [ ] `GET /manage/properties`: SELLER xem chỗ ở của mình (mọi trạng thái), ADMIN xem tất cả
- [ ] Test + commit

### 4. RoomType (loại phòng)
- [ ] SELLER thêm / sửa / xóa loại phòng trong chỗ ở của mình (giá/đêm, số khách, số phòng, ảnh)
- [ ] Test + commit

### 5. Seed dữ liệu mẫu
- [ ] `npm run seed:demo`: ~5 thành phố, tiện nghi, 2–3 SELLER, 10–15 chỗ ở `APPROVED` (mỗi chỗ vài loại phòng), vài CLIENT
- [ ] Chạy lại được nhiều lần (chỉ tạo cái chưa có)

---

## ★ Giai đoạn 2 — Frontend lần 1 (Claude dựng)

Stack: Next.js 16, Tailwind 4, shadcn/ui, **Redux Toolkit + RTK Query**, React Hook Form + Zod.

### Nền tảng
- [ ] Redux store theo từng request + `StoreProvider` (client)
- [ ] `baseQueryWithReauth`: bóc `{ data, statusCode }`, gặp 401 → refresh 1 lần (mutex) → gửi lại request, lỗi 422 → gắn vào đúng ô form
- [ ] Sinh type từ Swagger (`gen:api` hoặc `@rtk-query/codegen-openapi`)

### Auth (học theo Edu Platform)
- [ ] Route Handler `/api/auth/login | register | refresh-token | logout`: lưu token trong cookie httpOnly
- [ ] `proxy.ts`: chặn trang riêng tư, chặn `/login` khi đã đăng nhập, mất access token → `/refresh-token?redirect=...`, chặn sai role (làm mới token **trước** khi đọc role)
- [ ] Làm mới token trước khi hết hạn (còn < 1/3 thời gian sống), chống gọi refresh trùng
- [ ] Đăng xuất: `api.util.resetApiState()`, xóa cookie
- [ ] Trang đăng nhập, đăng ký, hồ sơ

### Trang
- [ ] Landing: Testimonials (chờ ảnh), thay logo / icon tạm bằng file export, menu ☰ trên điện thoại
- [ ] Ô tìm kiếm (thành phố, ngày, số khách) nối API
- [ ] Danh sách chỗ ở: lọc, tìm, phân trang trên URL
- [ ] Chi tiết chỗ ở: ảnh, tiện nghi, các loại phòng
- [ ] SELLER: quản lý chỗ ở, loại phòng
- [ ] ADMIN: duyệt chỗ ở, quản lý City, Amenity

---

## Giai đoạn 3 — Backend: đặt phòng ⚠️ nên tăng effort

### 6. Tìm phòng trống
- [ ] `GET /properties/:id/availability?checkIn=&checkOut=&guests=`
- [ ] Trống = `totalRooms` − tổng `quantity` của booking chưa hủy và **chồng ngày** (`checkIn < out` và `checkOut > in`)

### 7. Booking
- [ ] CLIENT đặt phòng trong **transaction + khóa dòng RoomType** (2 người không đặt trùng phòng cuối)
- [ ] Chụp lại giá lúc đặt, tính `nights`, `totalPrice`, sinh mã `BK...`
- [ ] `GET /bookings/me`, hủy đơn
- [ ] SELLER xem đơn của chỗ ở mình, đánh dấu `COMPLETED`; ADMIN xem tất cả
- [ ] Test (có test 2 request đặt cùng lúc) + commit

---

## ★ Giai đoạn 4 — Frontend lần 2
- [ ] Chọn ngày + số khách → xem phòng trống → đặt phòng
- [ ] "Đặt phòng của tôi", hủy đơn
- [ ] SELLER: xem đơn của chỗ ở mình

---

## Giai đoạn 5 — Hoàn thiện
- [ ] Review: chỉ booking `COMPLETED`, mỗi booking 1 lần, điểm trung bình trên Property (BE + FE)
- [ ] Deploy: FE → Vercel, BE → Render, DB → Neon

## Để sau (mở rộng)
- [ ] Upload ảnh (thay dán URL)
- [ ] Thanh toán online
- [ ] OTP email, quên mật khẩu, đăng nhập Google, 2FA
- [ ] Đa ngôn ngữ
- [ ] Chat giữa khách và chủ chỗ ở
- [ ] Giá theo ngày / mùa
