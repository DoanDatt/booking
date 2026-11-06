# Khái niệm backend (NestJS + Prisma + Zod)

Ghi chú các khái niệm đã học khi làm dự án. Mỗi mục: **là gì → dùng ở đâu trong dự án → lưu ý**.

---

## 1. Cấu trúc một module (7 file)

| File | Vai trò |
|---|---|
| `*.model.ts` | Zod schema + type (`z.infer`) — "hình dạng" dữ liệu |
| `*.dto.ts` | Class DTO tạo từ schema (`createZodDto`) để controller và Swagger dùng |
| `*.error.ts` | Các hàm tạo lỗi riêng của module (`() => new XException(...)`) |
| `*.repo.ts` | **Chỉ** query DB (Prisma) |
| `*.service.ts` | Logic nghiệp vụ, đổi lỗi Prisma thành lỗi HTTP |
| `*.controller.ts` | Nhận request, gọi service |
| `*.module.ts` | Khai báo controller + provider cho NestJS |

Luồng: `Request → Guard → Pipe (Zod) → Controller → Service → Repo → DB → Interceptor → Response`

- **Module**: NestJS không tự quét thư mục. Class nào không khai báo trong module thì không tồn tại (route 404, hoặc lỗi `can't resolve dependencies`). Module con phải được `imports` vào `AppModule`.
- `SharedModule` có `@Global()` → các service export ra (Prisma, Hashing, Token...) dùng được ở mọi module.
- Provider mặc định chỉ dùng trong module của nó; muốn chia sẻ phải `exports`.

## 2. Dependency Injection (DI)

- Khai báo thứ cần dùng trong `constructor(private readonly x: XService) {}` → NestJS tự tạo và truyền vào. Không tự `new`.
- `@Injectable()` cho phép class được tiêm và nhận tiêm.
- Service mặc định là **singleton** (cả app chỉ 1 instance) → cache trong biến của class sống suốt thời gian server chạy (ví dụ `SharedRoleRepository` cache id role CLIENT).
- Script chạy ngoài NestJS (seed) không có DI → phải tự `new PrismaService()`.

## 3. Nguồn dữ liệu của request

| Nguồn | Decorator | Ví dụ |
|---|---|---|
| Body | `@Body()` | JSON trong thân request |
| Params | `@Param()` | `/brands/5` → `brandId = "5"` (luôn là **chuỗi**) |
| Query | `@Query()` | `/rooms?page=2&limit=10` |
| Headers | `@Headers()` / tự viết | `Authorization: Bearer <token>`, `User-Agent` |
| IP | `@Ip()` | địa chỉ kết nối |

Dữ liệu người dùng gửi lên **không bao giờ tin hoàn toàn** → Zod kiểm tra, `.strict()` chặn field lạ, server tự gán những thứ quan trọng (`roleId`, mật khẩu đã băm, `createdById`).

## 4. Zod

| Cú pháp | Ý nghĩa |
|---|---|
| `.pick({ a: true })` | Chỉ lấy vài field |
| `.omit({ password: true })` | Lấy hết **trừ** vài field (không bao giờ trả `password`, `totpSecret`) |
| `.extend({ x: ... })` | Thêm field không có trong bảng (vd `confirmPassword`) |
| `.strict()` | Gửi field lạ → 422 (chặn tự gửi `roleId`) |
| `.superRefine()` | Kiểm tra liên quan **nhiều field** (password khớp confirmPassword) |
| `z.coerce.number()` | Đổi `"5"` → `5` (params trên URL) |
| `.nullable()` | Field có `?` trong Prisma thì `.nullable()`, không có `?` thì không |

- `z.infer<typeof Schema>` → sinh type TypeScript từ schema, không phải gõ type 2 lần.
- `createZodDto(Schema, { codec: true })`: chỉ dùng cho **DTO response có ngày giờ** (`DateTimeSchema`) → serializer đổi `Date` thành chuỗi ISO. DTO của body không cần.
- Mỗi route cần `@ZodResponse({ type: XResDTO })` → lọc field thừa ở response + Swagger biết response có gì. `status: HttpStatus.OK` để `@Post` trả 200 thay vì 201 (login, refresh, logout).

## 5. Prisma

### Chọn hàm tìm
| Hàm | `where` cần | Không tìm thấy |
|---|---|---|
| `findUnique` | cột `@id` / `@unique` **trong schema** | trả `null` |
| `findFirst` | cột bất kỳ | trả `null` |
| `...OrThrow` | như trên | **ném lỗi P2025** |

- `email`, `Role.name` là **partial unique index** (SQL tay trong migration) → Prisma không biết là unique → phải dùng `findFirst`.
- Dùng `...OrThrow` khi dữ liệu **chắc chắn phải có** (role CLIENT sau seed). Dùng bản trả `null` khi "không có" là bình thường (người dùng nhập sai email) để service tự quyết lỗi.

### Lỗi Prisma hay gặp
| Mã | Khi nào | Đổi thành |
|---|---|---|
| P2002 | Trùng unique (email đã tồn tại) | 422 |
| P2025 | Update/delete bản ghi không tồn tại | 404 (hoặc 401 với refresh token) |

- Đọc lỗi Prisma dài: xem **dòng cuối** hoặc dòng `Property '...' is missing` trước.
- `tsc` không bắt được mọi lỗi Prisma (vd `deletedAt: 'Client Role'` hợp lệ kiểu nhưng sai khi chạy).

### Khác
- `include: { role: true }` → JOIN sang bảng khác (`user.role.name`). Lồng được: `include: { user: { include: { role: true } } }`.
- `omit: { password: true }` → DB không trả cột đó (lớp bảo vệ thứ 2 bên cạnh Zod `.omit`).

## 6. Xóa mềm vs xóa cứng

- **Xóa cứng**: `delete` → mất dòng thật. Dùng cho Language (id là chuỗi do người dùng đặt; xóa mềm sẽ chặn tạo lại cùng id).
- **Xóa mềm**: `update` gán `deletedAt`, `deletedById` → dòng còn trong DB, mọi query lọc `deletedAt: null`. Dùng khi bảng khác tham chiếu tới (Brand → Product).
- Khi xóa mềm, `where` phải có `deletedAt: null` → xóa lần 2 sẽ ra P2025 → 404.

## 7. JavaScript / TypeScript hay dùng

- **Spread `{ ...obj, x }`**: tạo **object mới** gồm các field của `obj` + `x`. Object gốc **không bị đổi**. Trùng tên field thì field viết **sau** thắng. Dùng để không làm hỏng dữ liệu của nơi gọi hàm (immutability).
- **Destructuring** `({ a, b }: Type) => ...`: tách object thành biến riêng ngay ở tham số.
- **`A & B`**: gộp 2 kiểu (`LoginBodyType & { userAgent: string; ip: string }`).
- **`Pick<T, 'a' | 'b'>` / `Omit<T, 'a'>`**: phiên bản TypeScript của `.pick()` / `.omit()` bên Zod.
- **`?.`**: không có thì trả `undefined` thay vì crash. **`??`**: giá trị mặc định khi `null`/`undefined`.
- **`as const`**: giữ đúng chữ (`'ADMIN'`) thay vì `string`.
- **`return await` trong `try`**: thiếu `await` thì lỗi xảy ra sau khi đã ra khỏi `try` → `catch` không bắt được. Ngoài `try/catch` thì `return promise` là đủ.
- **Luôn `throw error` ở cuối `catch`**: không "nuốt" lỗi lạ.
- **Thứ tự hàm trong class không quan trọng**: hàm trên gọi được hàm khai báo phía dưới.

## 8. Định dạng response và lỗi

- Thành công: `{ data, statusCode }` (do `CustomZodSerializerInterceptor` bọc).
- Lỗi: `{ message, error, statusCode }` — một lớp (đã bỏ `catchError` trong interceptor để không bọc 2 lần).
- Lỗi gắn với ô input: `422` + `message: [{ message: 'Error.X', path: 'field' }]` → FE hiện lỗi dưới đúng ô.
- Lỗi không gắn ô nào (token): `401` + `message: 'Error.X'`.
- Lỗi của thư viện (JWT) không phải `HttpException` → nếu không bắt sẽ thành 500. Bắt lại bằng `if (error instanceof HttpException) throw error` rồi ném lỗi HTTP phù hợp.

## 9. Cấu hình `.env`

- `config.ts` dùng Zod kiểm tra `process.env` → thiếu biến thì server **dừng ngay khi khởi động**.
- Kiểu của `envConfig` suy ra từ **schema**, không phải từ file `.env` → thêm biến vào `.env` mà quên thêm vào `configSchema` thì `envConfig.X` báo lỗi.
- `.env`: giá trị **thật**, **không commit**. `.env.example`: chỉ tên biến + giá trị **mẫu**, có commit. Không bao giờ để khóa bí mật thật trong `.env.example`.

## 10. Seed

- Script chạy **một lần** để tạo dữ liệu app cần có sẵn: 3 role + tài khoản admin (`npm run init-seed-data`, chạy bằng `tsx`).
- Kiểm tra trước (`role.count() > 0`) để chạy lần 2 không tạo trùng.
- Cuối script `prisma.$disconnect()` để script thoát.

## 11. Role (RBAC)

- 3 role mặc định: **ADMIN** (toàn quyền), **CLIENT** (khách), **SELLER** (người bán / chủ chỗ ở).
- Role lưu trong **DB** → thêm role không cần sửa code. Code dựa vào **tên** role (`RoleName.Client`) nên phải seed sẵn.
- Đăng ký luôn ra CLIENT (server tự gán). ADMIN chỉ có qua seed.
- Trang lớn dùng nhiều role hơn + phân quyền theo thuộc tính (ABAC); RBAC 3 role là khung tối thiểu.

## 12. Băm mật khẩu (bcrypt)

- `hash('123456')` → `$2b$10$...` (60 ký tự), mỗi lần băm ra chuỗi khác nhau. Không bao giờ lưu mật khẩu gốc.
- `compare(matKhauNhap, chuoiDaBam)` để kiểm tra khi login.
- Chậm có chủ đích (vài chục ms) để kẻ xấu khó dò mật khẩu.

## 13. JWT và token

### JWT
- Chuỗi 3 phần `header.payload.chữ_ký`.
- **Payload**: dữ liệu bên trong token (`{ userId, deviceId, roleId, roleName, uuid, iat, exp }`). **Server tự tạo** từ DB, không phải body người dùng. Ai cũng **đọc** được (jwt.io) → không để mật khẩu. Không ai **sửa** được → sửa là sai chữ ký.
- **Chữ ký**: tạo từ payload + khóa bí mật (`*_SECRET`), chỉ server biết.
- `iat` (thời điểm ký) và `exp` (hết hạn) do thư viện tự thêm. `exp` tính bằng **giây** → `new Date(exp * 1000)`.

### Ba động từ
| | Nghĩa |
|---|---|
| **Ký** (`sign`) | **Tạo** token (chỉ là một chuỗi trong RAM, không lưu gì) |
| **Xác minh** (`verify`) | Kiểm tra chữ ký + hạn, lấy payload ra |
| **Lưu** | Ghi DB bằng Prisma — chỉ làm với refresh token |

### Hai loại token
| | Access token | Refresh token |
|---|---|---|
| Dùng để | Gọi API (`Authorization: Bearer ...`) | Chỉ để xin cặp token mới |
| Sống | 15 phút | 7 ngày |
| Lưu DB | ❌ | ✅ bảng `RefreshToken` |
| Thu hồi được | ❌ (chờ hết hạn) | ✅ (xóa khỏi DB) |
| Payload | userId, deviceId, roleId, roleName | userId |

- Hai khóa bí mật khác nhau → không dùng refresh token thay access token được.
- `uuid` trong payload → 2 token ký cùng 1 giây vẫn khác nhau (cột `token` là `@unique`).

### Luồng
```
login     → kiểm tra email + mật khẩu → tạo Device → ký 2 token → lưu refresh token → trả về FE
gọi API   → Authorization: Bearer <access> → guard verify → cho qua
hết hạn   → POST /auth/refresh-token { refreshToken } → xóa token cũ → cấp cặp mới (role lấy mới nhất từ DB)
logout    → xóa refresh token + Device.isActive = false
```
- **Rotation**: refresh token dùng **một lần**. Dùng lại token cũ → 401 `RefreshTokenAlreadyUsed` (dấu hiệu bị đánh cắp).
- Login sai email hoặc sai mật khẩu → **cùng một lỗi** để không lộ email nào đã đăng ký.

## 14. Device

- Mỗi lần login tạo một Device (`userAgent`, `ip`, `isActive`). Refresh token gắn với Device.
- Cho phép: xem danh sách thiết bị đang đăng nhập, đăng xuất từ xa, đăng xuất khỏi mọi thiết bị, cảnh báo đăng nhập lạ.
- Logout chỉ đăng xuất **đúng thiết bị đang dùng**.
- `userAgent`, `ip` người dùng sửa được (Postman) → chỉ dùng để ghi lại, không dùng để quyết định quyền.

## 15. `totpSecret` (2FA)

- Khóa bí mật dùng chung giữa server và app Authenticator (quét QR). Mã 6 số = công thức(khóa, thời gian), đổi mỗi 30 giây.
- `null` = chưa bật 2FA. Bí mật ngang `password` → luôn `omit`.

## 16. Decorator

| Loại | Ví dụ | Tác dụng |
|---|---|---|
| Class | `@Controller`, `@Injectable`, `@Module` | Cho NestJS biết class là gì |
| Method | `@Get`, `@Post`, `@ZodResponse`, `@IsPublic` | Route nào, response ra sao, gắn nhãn |
| Tham số | `@Body`, `@Param`, `@Ip`, `@UserAgent`, `@ActiveUser` | Lấy dữ liệu từ request đưa vào tham số |

- Tự viết decorator tham số: `createParamDecorator((data, ctx) => ...)` → cách lấy dữ liệu viết 1 lần, dùng nhiều nơi, mang sang dự án khác được.
- **`SetMetadata(key, value)`**: chỉ **dán nhãn** lên hàm/class, không chạy logic. Nơi khác (guard) đọc nhãn bằng `Reflector`.

### `@ActiveUser()`
- Lấy payload của access token **mà guard đã gắn vào `request.user`** (guard ghi, decorator đọc, chung key `REQUEST_USER_KEY`).
- `@ActiveUser('userId')` → một field; `@ActiveUser()` → cả payload.
- `field: keyof AccessTokenPayload` → chỉ được truyền tên field có thật, gõ sai TS báo lỗi.
- `user?.[field]`: ngoặc vuông để lấy field có tên **nằm trong biến** `field`.
- Dùng cho `createdById` / `updatedById` / `deletedById` thay vì `null` hay lấy từ body (body thì người dùng giả được, token thì không).
- **Không dùng ở route `@IsPublic()`**: guard không verify token ở đó → `request.user` là `undefined`.

| Decorator tham số | Lấy từ | Ai đặt vào |
|---|---|---|
| `@UserAgent()` | `request.headers['user-agent']` | Trình duyệt |
| `@Ip()` | `request.ip` | Kết nối mạng |
| `@ActiveUser()` | `request.user` | AccessTokenGuard |

## 17. Guard

- **Người gác cổng** chạy **trước** Pipe (Zod) và Controller. Trả `true` → cho qua; ném lỗi → chặn (controller không chạy).
- Class guard `implements CanActivate` → bắt buộc có hàm tên đúng `canActivate`.
- **Guard toàn cục** (`{ provide: APP_GUARD, useClass: AccessTokenGuard }`): mọi route mặc định bị khóa; route công khai phải chủ động gắn `@IsPublic()`. Quên gắn thì route bị khóa nhầm (dễ thấy), không bị lộ.

### `context` (ExecutionContext)
"Tờ phiếu thông tin" về request đang xử lý:
- `context.getHandler()` → hàm sẽ xử lý (vd `create`)
- `context.getClass()` → class controller (vd `BrandController`)
- `context.switchToHttp().getRequest()` → object request (headers, body, ip...)

### `Reflector`
"Người đọc nhãn". `reflector.getAllAndOverride(KEY, [getHandler(), getClass()])` → tìm nhãn trên hàm trước, không có thì tìm trên class.

| Vai | Ai làm |
|---|---|
| Dán nhãn | `@IsPublic()` (SetMetadata) |
| Đọc nhãn | `Reflector` |
| Quyết định | Guard |

### AccessTokenGuard
```
có nhãn isPublic?           → cho qua
lấy "Authorization: Bearer <token>" (split(' ')[1]) → không có → 401 MissingAccessToken
verifyAccessToken           → sai/hết hạn → 401 InvalidAccessToken
request.user = payload      → cho qua (controller lấy lại bằng @ActiveUser)
```
Guard không query DB → nhanh dù chạy ở mọi request.

### RolesGuard + `@Roles()`
- Cách làm giống `@IsPublic()`: `@Roles(RoleName.Admin)` dán nhãn `roles = ['ADMIN']`, `RolesGuard` đọc bằng `Reflector` rồi so với `request.user.roleName`.
- Không có nhãn `@Roles` → ai đã đăng nhập cũng qua. Thiếu quyền → **403 Forbidden**.
- **401** = "không biết bạn là ai" (không/sai token). **403** = "biết bạn là ai nhưng không có quyền".
- Guard toàn cục chạy **theo thứ tự khai báo** trong `providers`: `AccessTokenGuard` trước (gắn `request.user`), `RolesGuard` sau (cần `request.user`).
- Gắn `@Roles` lên **từng hàm**, không lên class: route GET có `@IsPublic()` không có `request.user` → nếu class có `@Roles` thì GET bị 403.
- `@Roles(...)` nhận nhiều role: `@Roles(RoleName.Admin, RoleName.Seller)`.
- Role chỉ là **lớp 1** (có được gọi API này không). **Lớp 2** là kiểm tra sở hữu trong service (`property.ownerId === user.userId`), vì cần dữ liệu từ DB.

```
Request → AccessTokenGuard (401) → RolesGuard (403) → Pipe/Zod (422) → Controller
```

### Cú pháp TS mới
- **Rest parameter `(...roles: T[])`**: gom bao nhiêu tham số cũng được thành **mảng**. Ngược với spread (trải mảng/object ra).
- **`(typeof RoleName)[keyof typeof RoleName]`**: lấy kiểu `'ADMIN' | 'CLIENT' | 'SELLER'` từ chính object hằng số (cần `as const`). `keyof` → tên key, `[...]` → giá trị của các key đó.
- **`.includes(x)`**: mảng có chứa `x` không.
