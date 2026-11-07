import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api";

// Thêm slice mới (auth, bộ lọc tìm kiếm, ...) vào đây.
const rootReducer = combineSlices(baseApi);

// Tạo store mới cho mỗi request (không dùng store toàn cục), để dữ liệu của
// người dùng này không lọt sang request của người khác khi render trên server.
export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
