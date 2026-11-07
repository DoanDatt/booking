import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

// Lấy từ biến môi trường, nếu không có thì dùng backend local
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// baseQuery có sẵn: bọc fetch, trả về { data } hoặc { error }, không throw
const rawBaseQuery = fetchBaseQuery({ baseUrl: API_URL });

// baseQuery tự viết: backend trả về { data, statusCode } -> lấy riêng phần data
// để các endpoint nhận đúng payload. Lỗi thì giữ nguyên.
const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.data && typeof result.data === "object" && "data" in result.data) {
    return { ...result, data: (result.data as { data: unknown }).data };
  }
  return result;
};

// Chỉ tạo một API gốc, các module (city, property...) gắn endpoint vào bằng injectEndpoints
export const baseApi = createApi({
  reducerPath: "api", // cache nằm ở state.api
  baseQuery,
  tagTypes: ["City", "Amenity", "Property", "RoomType", "Profile"],
  endpoints: () => ({}), // để trống, các module tự gắn sau
});
