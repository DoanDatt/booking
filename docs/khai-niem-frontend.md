# Khái niệm frontend (Next.js + Redux Toolkit + Ant Design)

Ghi chú các khái niệm đã học khi làm dự án. Mỗi mục: **là gì → dùng ở đâu trong dự án → lưu ý**.

---

## 1. Redux giải quyết vấn đề gì?

- `useState` chỉ sống trong **một** component. Khi nhiều component ở xa nhau cùng cần một dữ liệu (user đang đăng nhập cần ở header, trang hồ sơ, nút đặt phòng) thì phải truyền props qua nhiều tầng (_prop drilling_) hoặc dùng Context.
- Redux đưa state đó ra **một kho chung nằm ngoài cây component**, gọi là **store**. Component nào cần thì đọc thẳng từ store.

```
             ┌──────────── STORE ────────────┐
             │ { auth: { user: {...} },      │
             │   search: { cityId: 4 },      │
             │   api: { ...cache API } }     │
             └──────▲─────────────────┬──────┘
        dispatch(action)           đọc (selector)
                    │                 ▼
   [Nút Đăng xuất] ─┘          [Header] [Trang hồ sơ]
```

## 2. Năm khái niệm cốt lõi

| Khái niệm | Là gì | Ví dụ |
|---|---|---|
| **Store** | Object chứa toàn bộ state chung của app | `{ auth: { user: null } }` |
| **Action** | Object mô tả _chuyện vừa xảy ra_, có `type` và `payload` (tùy chọn) | `{ type: "auth/loggedOut" }` |
| **Reducer** | Hàm thuần `(stateCũ, action) => stateMới` | gặp `loggedOut` → `user = null` |
| **dispatch** | Hàm gửi action vào store | `dispatch(loggedOut())` |
| **Selector** | Hàm lấy một phần state ra | `(state) => state.auth.user` |

Luồng **một chiều**:

```
Component ──dispatch(action)──▶ Reducer ──state mới──▶ Store ──▶ component đang đọc phần đó render lại
```

- Component **không sửa state trực tiếp**, chỉ "báo chuyện gì vừa xảy ra" bằng action → mọi thay đổi đều đi qua reducer → dễ debug (Redux DevTools cho xem lại từng action).
- Reducer phải là **hàm thuần**: không gọi API, không `Math.random()`, không sửa state cũ. Cùng input → cùng output.
- Component chỉ render lại khi **phần state mà selector của nó trả về** thay đổi, không phải mỗi khi store đổi.

## 3. Redux Toolkit (RTK) và `createSlice`

- **RTK** là cách viết Redux chính thức hiện nay. Redux đời đầu phải viết tay action type, action creator, `switch` trong reducer, nên rất dài dòng.
- **Slice** = một "lát" của store (ví dụ `auth`, `search`), gồm `name` + `initialState` + `reducers`. `createSlice` **tự sinh action** từ tên reducer.

```ts
const authSlice = createSlice({
  name: "auth",                                    // → action type "auth/loggedIn"
  initialState: { user: null as User | null },
  reducers: {
    loggedIn(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    loggedOut(state) {
      state.user = null;
    },
  },
});
export const { loggedIn, loggedOut } = authSlice.actions;
```

- **Immer**: trong `createSlice` được viết `state.user = ...` (trông như sửa trực tiếp). Immer ghi lại thay đổi và tạo object **mới** thay bạn. Hoặc sửa `state`, hoặc `return` state mới, **không làm cả hai**. Ra ngoài `createSlice` thì không được sửa state kiểu này.
- `PayloadAction<T>`: kiểu của action có `payload: T` → `dispatch(loggedIn(user))` sai kiểu là TypeScript báo ngay.

## 4. `configureStore` và `combineSlices`

- `combineSlices(sliceA, sliceB, api)`: gộp nhiều slice thành **một reducer gốc**, mỗi slice nằm dưới key bằng `name` của nó (`state.auth`, `state.api`...).
- `configureStore({ reducer, middleware })`: tạo store, tự bật Redux DevTools và các kiểm tra lỗi khi dev (phát hiện sửa state sai cách, state chứa giá trị không serialize được).
- **Middleware**: lớp chen giữa `dispatch` và reducer để làm việc phụ (gọi API, log...). RTK Query cần thêm middleware của nó: `getDefaultMiddleware().concat(baseApi.middleware)`.
- Các type lấy ra từ store để dùng khắp nơi:

```ts
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;   // hình dạng toàn bộ state
export type AppDispatch = AppStore["dispatch"];
```

## 5. Store theo từng request (Next.js)

- Trong app React thường (chạy hết ở trình duyệt) chỉ cần `export const store = configureStore(...)`, **một** store toàn cục.
- Next.js render trên **server** cho nhiều người cùng lúc. Nếu dùng một store toàn cục trên server, dữ liệu của user A có thể lọt sang trang của user B.
- Vì vậy viết `makeStore()` là **hàm**, mỗi request gọi một lần để tạo store mới. Trong component client:

```tsx
const [store] = useState(makeStore);   // lazy init: chỉ gọi makeStore lần đầu render
```

- Không dùng `useState(makeStore())`, vì cách đó gọi `makeStore()` ở **mọi** lần render rồi bỏ đi.
- Server Component **không** dùng được Redux (Redux dùng hook và Context). Trang cần SEO có thể fetch thẳng trong Server Component; Redux dùng cho phần tương tác ở client.

## 6. `<Provider>` và hook có kiểu

- `<Provider store={store}>` (của `react-redux`) đưa store vào cây component qua Context, giống `QueryClientProvider` bên Edu. Đặt trong `src/app/providers.tsx` (file `"use client"`), bọc ngoài cùng.
- Hook gốc: `useSelector` (đọc), `useDispatch` (lấy `dispatch`), `useStore` (lấy cả store). Tạo bản **có kiểu sẵn** một lần để khỏi lặp `RootState` ở mọi nơi:

```ts
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
```

## 7. RTK Query: lấy dữ liệu từ server

- Một phần của RTK, thay cho TanStack Query. Lo hết việc fetch, cache, loading/error, gọi lại khi dữ liệu cũ. Cache nằm **trong Redux store** (`state.api`).

| TanStack Query (Edu) | RTK Query (Booking) |
|---|---|
| `useQuery({ queryKey, queryFn })` | Khai báo `build.query` một lần → hook `useGetCitiesQuery()` được sinh tự động |
| `useMutation(...)` | `build.mutation` → `useCreateCityMutation()` |
| `queryClient.invalidateQueries(["cities"])` | **Tag**: query `providesTags: ["City"]`, mutation `invalidatesTags: ["City"]` |
| `QueryClientProvider` | `<Provider store={store}>` |
| `queryKey` | Tự sinh từ tên endpoint + tham số |

- **`createApi`**: tạo "API gốc" gồm `reducerPath` (key trong store), `baseQuery` (hàm gửi request), `tagTypes` (danh sách tag), `endpoints`.
- **`fetchBaseQuery({ baseUrl })`**: `baseQuery` có sẵn, bọc `fetch`. Kết quả luôn có dạng `{ data }` hoặc `{ error }`, **không throw**.
- **`baseQuery` tự viết**: bọc `fetchBaseQuery` để xử lý chung cho mọi request. Trong dự án: bóc `{ data, statusCode }` của backend; sau này thêm gặp 401 → refresh token → gửi lại.
- **`injectEndpoints`**: mỗi module (city, property...) gắn endpoint vào **cùng một** `baseApi` → chung cache, chung tag. Nên chỉ có **một** `createApi` cho mỗi backend.
- **Tag**: query khai báo "dữ liệu này thuộc nhóm `City`"; mutation khai báo "tôi làm nhóm `City` cũ đi" → mọi query đang mở có tag đó **tự gọi lại**. Có thể chi tiết theo id: `{ type: "City", id: 4 }`.
- **`.unwrap()`**: mutation trả về `{ data } | { error }`; `.unwrap()` biến nó thành Promise **throw khi lỗi**, để dùng được `try/catch`.

```ts
export const cityApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCities: build.query<{ data: City[] }, void>({   // <kiểu trả về, kiểu tham số>
      query: () => "/cities",
      providesTags: ["City"],
    }),
    createCity: build.mutation<City, CreateCityBody>({
      query: (body) => ({ url: "/cities", method: "POST", body }),
      invalidatesTags: ["City"],
    }),
  }),
});
export const { useGetCitiesQuery, useCreateCityMutation } = cityApi;
```

## 8. State nên để ở đâu?

| Loại dữ liệu | Để ở đâu | Ví dụ trong Booking |
|---|---|---|
| Dữ liệu từ backend | **RTK Query** | thành phố, chỗ ở, loại phòng, hồ sơ |
| State client nhiều trang cùng dùng | **Slice** | user đang đăng nhập, bộ lọc tìm kiếm |
| State của một component | **`useState`** | modal mở/đóng, tab đang chọn |
| State cần chia sẻ qua link | **URL** (`searchParams`) | trang hiện tại, bộ lọc trên trang danh sách |

- Lỗi hay gặp: **chép dữ liệu API vào slice**. Đừng làm vậy, RTK Query đã cache nó rồi; chép ra thì có hai bản và dễ lệch nhau.

---

## 9. Ant Design trong Next.js

- **CSS-in-JS**: antd sinh CSS bằng JavaScript lúc render. Trên server, `AntdRegistry` gom CSS đó và chèn vào HTML; nếu thiếu thì trang hiện ra chưa có style rồi mới "nháy" đúng.
- **`@layer` CSS**: `AntdRegistry layer` bọc CSS antd trong `@layer antd`. `globals.css` khai báo thứ tự `@layer theme, base, antd, components, utilities;`, layer sau thắng layer trước → class Tailwind (`utilities`) ghi đè được antd.
- **`ConfigProvider`**: đặt theme (`token.colorPrimary`...) và ngôn ngữ (`vi_VN`) cho mọi component antd bên trong. Màu nằm ở `src/lib/antd-theme.ts`.
- **`<App component={false}>`**: cho phép dùng `App.useApp()` để lấy `message` / `notification` / `modal` đúng theme. `component={false}` để không sinh thêm `<div class="ant-app">`; có div đó thì style `a { color }` của antd nhuộm màu mọi link trên landing.
- **Vì sao tắt `cacheComponents`**: chế độ này cấm gọi `Date.now()` / `Math.random()` khi prerender, mà mọi component antd đều gọi `Date.now()` lúc render (cache style trong `@ant-design/cssinjs-utils`) → build lỗi. Xem lại khi lên Next 17.
