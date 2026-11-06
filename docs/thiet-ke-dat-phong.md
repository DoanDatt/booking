# Thiết kế schema — web đặt phòng

Quyết định đã chốt (2026-11-06):

| Vấn đề | Chọn |
|---|---|
| Một Booking gồm | **1 loại phòng / đơn** (có thể nhiều phòng cùng loại) |
| Tính phòng trống | **Tính từ Booking** (không có bảng tồn kho theo ngày), giá cố định mỗi đêm |
| Chỗ ở của SELLER | **ADMIN duyệt**: `PENDING → APPROVED / REJECTED`, chỉ `APPROVED` mới hiện cho khách |
| Thanh toán MVP | **Trả tại chỗ ở**: đặt xong là `CONFIRMED` |
| Tiền | `Int` (VND, không có phần lẻ) |
| Ngày nhận/trả phòng | `@db.Date` (chỉ ngày, không giờ) |

---

## 1. Quan hệ

```
City 1─n Property 1─n RoomType 1─n Booking 1─1 Review
              │  n─n Amenity
              └─ ownerId → User (SELLER)
Booking.userId → User (CLIENT)     Review.userId → User
```

## 2. Tính phòng trống

```
trống = RoomType.totalRooms − SUM(Booking.quantity)
        với Booking cùng roomTypeId, status ≠ CANCELLED, và CHỒNG NGÀY:
        booking.checkIn < checkOutMuốnĐặt  AND  booking.checkOut > checkInMuốnĐặt
```
- Trả phòng ngày 13 và nhận phòng ngày 13 **không chồng** (dùng `<` / `>`, không dùng `<=` / `>=`).
- Hai người cùng đặt phòng cuối: transaction + khóa dòng RoomType (`SELECT ... FOR UPDATE`) → làm ở module Booking.

## 3. Luồng trạng thái

```
Property:  PENDING ──ADMIN duyệt──► APPROVED
              │                         │ SELLER sửa thông tin quan trọng → (tùy chọn) về PENDING
              └──ADMIN từ chối──► REJECTED (kèm rejectReason) ──SELLER sửa──► PENDING

Booking:   CONFIRMED ──khách/SELLER hủy──► CANCELLED
              │
              └──sau ngày checkOut──► COMPLETED ──► khách được viết Review (1 lần)
```

---

## 4. Schema mới (Prisma)

### Enum
```prisma
enum PropertyType {
  HOTEL
  HOMESTAY
  APARTMENT
  RESORT
  VILLA
}

enum PropertyStatus {
  PENDING
  APPROVED
  REJECTED
}

enum BookingStatus {
  CONFIRMED
  CANCELLED
  COMPLETED
}
```

### City — điểm đến (ADMIN quản lý)
```prisma
model City {
  id         Int        @id @default(autoincrement())
  name       String     @db.VarChar(200)
  slug       String     @db.VarChar(200) // "da-lat" → dùng trên URL, unique bằng partial index
  imageUrl   String?    @db.VarChar(1000)
  properties Property[]

  createdById Int?
  createdBy   User? @relation("CityCreatedBy", fields: [createdById], references: [id], onDelete: SetNull, onUpdate: NoAction)
  updatedById Int?
  updatedBy   User? @relation("CityUpdatedBy", fields: [updatedById], references: [id], onDelete: SetNull, onUpdate: NoAction)
  deletedById Int?
  deletedBy   User? @relation("CityDeletedBy", fields: [deletedById], references: [id], onDelete: SetNull, onUpdate: NoAction)

  deletedAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([deletedAt])
}
```

### Amenity — tiện nghi (ADMIN quản lý)
```prisma
model Amenity {
  id         Int        @id @default(autoincrement())
  name       String     @db.VarChar(200)
  icon       String     @default("") @db.VarChar(100) // tên icon FE dùng, vd "wifi"
  properties Property[] // n-n: Prisma tự tạo bảng nối

  createdById Int?
  createdBy   User? @relation("AmenityCreatedBy", fields: [createdById], references: [id], onDelete: SetNull, onUpdate: NoAction)
  updatedById Int?
  updatedBy   User? @relation("AmenityUpdatedBy", fields: [updatedById], references: [id], onDelete: SetNull, onUpdate: NoAction)
  deletedById Int?
  deletedBy   User? @relation("AmenityDeletedBy", fields: [deletedById], references: [id], onDelete: SetNull, onUpdate: NoAction)

  deletedAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([deletedAt])
}
```

### Property — chỗ ở (SELLER sở hữu, ADMIN duyệt)
```prisma
model Property {
  id           Int            @id @default(autoincrement())
  name         String         @db.VarChar(500)
  type         PropertyType
  description  String         @default("")
  address      String         @db.VarChar(500)
  starRating   Int? // 1–5, homestay có thể không có
  images       String[]
  checkInTime  String         @default("14:00") @db.VarChar(5)
  checkOutTime String         @default("12:00") @db.VarChar(5)
  status       PropertyStatus @default(PENDING)
  rejectReason String?        @db.VarChar(1000)

  ownerId   Int
  owner     User       @relation("PropertyOwner", fields: [ownerId], references: [id], onDelete: NoAction, onUpdate: NoAction)
  cityId    Int
  city      City       @relation(fields: [cityId], references: [id], onDelete: NoAction, onUpdate: NoAction)
  amenities Amenity[]
  roomTypes RoomType[]
  bookings  Booking[]
  reviews   Review[]

  deletedAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([cityId, status]) // tìm chỗ ở APPROVED theo thành phố
  @@index([ownerId])
  @@index([deletedAt])
}
```

### RoomType — loại phòng
```prisma
model RoomType {
  id            Int       @id @default(autoincrement())
  propertyId    Int
  property      Property  @relation(fields: [propertyId], references: [id], onDelete: Cascade, onUpdate: NoAction)
  name          String    @db.VarChar(500) // "Deluxe giường đôi"
  description   String    @default("")
  pricePerNight Int // VND
  maxGuests     Int // số khách tối đa / phòng
  totalRooms    Int // khách sạn có bao nhiêu phòng loại này
  bedType       String    @default("") @db.VarChar(200)
  sizeM2        Int?
  images        String[]
  bookings      Booking[]

  deletedAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([propertyId])
  @@index([deletedAt])
}
```

### Booking — đơn đặt phòng
```prisma
model Booking {
  id            Int           @id @default(autoincrement())
  code          String        @unique @db.VarChar(20) // mã cho khách: "BK7X2K9P"
  userId        Int
  user          User          @relation("UserBookings", fields: [userId], references: [id], onDelete: NoAction, onUpdate: NoAction)
  propertyId    Int // lưu thêm để SELLER/khách lọc đơn theo chỗ ở mà không cần JOIN qua RoomType
  property      Property      @relation(fields: [propertyId], references: [id], onDelete: NoAction, onUpdate: NoAction)
  roomTypeId    Int
  roomType      RoomType      @relation(fields: [roomTypeId], references: [id], onDelete: NoAction, onUpdate: NoAction)
  checkIn       DateTime      @db.Date
  checkOut      DateTime      @db.Date
  nights        Int
  quantity      Int // số phòng
  guests        Int
  pricePerNight Int // CHỤP LẠI giá lúc đặt — SELLER đổi giá sau cũng không ảnh hưởng đơn cũ
  totalPrice    Int // pricePerNight × nights × quantity
  status        BookingStatus @default(CONFIRMED)
  guestName     String        @db.VarChar(500)
  guestPhone    String        @db.VarChar(50)
  note          String        @default("")
  cancelledAt   DateTime?
  review        Review?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([roomTypeId, status, checkIn, checkOut]) // phục vụ câu tính phòng trống
  @@index([userId])
  @@index([propertyId])
}
```
Booking **không xóa mềm**: hủy thì đổi `status = CANCELLED` (giữ lịch sử).

### Review — đánh giá (1 booking COMPLETED → tối đa 1 review)
```prisma
model Review {
  id         Int      @id @default(autoincrement())
  bookingId  Int      @unique
  booking    Booking  @relation(fields: [bookingId], references: [id], onDelete: Cascade, onUpdate: NoAction)
  userId     Int
  user       User     @relation("UserReviews", fields: [userId], references: [id], onDelete: NoAction, onUpdate: NoAction)
  propertyId Int
  property   Property @relation(fields: [propertyId], references: [id], onDelete: Cascade, onUpdate: NoAction)
  rating     Int // 1–5
  comment    String   @default("")

  deletedAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([propertyId])
}
```

---

## 5. Sửa các model cũ

### Xóa hẳn (thuộc ecom)
`Product`, `ProductTranslation`, `Category`, `CategoryTranslation`, `SKU`, `Brand`, `BrandTranslation`, `CartItem`, `ProductSKUSnapshot`, `Order`, `Payment`, `PaymentTransaction`, `Review` (bản cũ), `ReviewMedia`, `Message`, `Websocket`.

Enum xóa: `PaymentStatus`, `OrderStatus`, `MediaType`.

Giữ: `Language`, `User`, `UserTranslation`, `VerificationCode`, `Device`, `RefreshToken`, `Permission`, `Role`; enum `VerificationCodeType`, `UserStatus`, `HTTPMethod`.

### `Language` — bỏ 3 dòng
`productTranslations`, `categoryTranslations`, `brandTranslations`.

### `User` — bỏ các dòng quan hệ trỏ tới bảng đã xóa
`carts`, `orders`, `reviews` (cũ), `createdProducts/updated/deleted`, `createdCategories/...`, `createdSKUS/...`, `createdBrands/...`, `createdProductTranslations/...`, `createdCategoryTranslations/...`, `createdBrandTranslations/...`, `createdOrders/...`, `soldOrders`, `sentMessages`, `receivedMessages`, `webSockets`.

### `User` — thêm
```prisma
  properties       Property[] @relation("PropertyOwner")
  bookings         Booking[]  @relation("UserBookings")
  reviews          Review[]   @relation("UserReviews")
  createdCities    City[]     @relation("CityCreatedBy")
  updatedCities    City[]     @relation("CityUpdatedBy")
  deletedCities    City[]     @relation("CityDeletedBy")
  createdAmenities Amenity[]  @relation("AmenityCreatedBy")
  updatedAmenities Amenity[]  @relation("AmenityUpdatedBy")
  deletedAmenities Amenity[]  @relation("AmenityDeletedBy")
```

---

## 6. Partial unique index (SQL tay)

Giữ từ bản cũ: `User_email_unique`, `Role_name_unique`, `permission_path_method_unique`.
Bỏ: các index của BrandTranslation, CategoryTranslation, ProductTranslation, SKU.
Thêm:
```sql
CREATE UNIQUE INDEX "City_slug_unique"
ON "City" (slug)
WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "Amenity_name_unique"
ON "Amenity" (name)
WHERE "deletedAt" IS NULL;
```

## 7. Ai làm gì (dự kiến API)

| Module | Khách | CLIENT | SELLER | ADMIN |
|---|---|---|---|---|
| City, Amenity | xem | xem | xem | CRUD |
| Property | xem APPROVED | xem APPROVED | CRUD của mình (về PENDING) | xem tất cả, duyệt/từ chối |
| RoomType | xem | xem | CRUD trong Property của mình | CRUD |
| Tìm phòng trống | ✅ | ✅ | ✅ | ✅ |
| Booking | — | đặt, xem của mình, hủy | xem đơn của chỗ ở mình, hủy, đánh dấu COMPLETED | xem tất cả |
| Review | xem | viết (booking COMPLETED của mình) | xem | ẩn/xóa |

Thứ tự làm: City → Amenity → Property (+ duyệt) → RoomType → Tìm phòng trống → Booking → Review → FE.
