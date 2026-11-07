import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api";

// Gộp slice và API thành reducer gốc. Sau này thêm: combineSlices(baseApi, authSlice, ...)
const rootReducer = combineSlices(baseApi);

// Viết dạng HÀM: mỗi request tạo một store mới, để dữ liệu của user này
// không lọt sang user khác khi Next render trên server
export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    // RTK Query cần middleware riêng để xử lý cache, gọi lại và xóa dữ liệu cũ
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
