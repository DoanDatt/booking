import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const rawBaseQuery = fetchBaseQuery({ baseUrl: API_URL });

// Backend bọc mọi response thành công thành { data, statusCode } -> bóc ra `data`
// để endpoint nhận đúng payload. Lỗi giữ nguyên format NestJS
// ({ message, statusCode }; 422 thì message là mảng [{ message, path }]).
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

// Một API gốc duy nhất; mỗi module (city, property, ...) gắn thêm endpoint bằng
// baseApi.injectEndpoints để cache và invalidate tag dùng chung.
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["City", "Amenity", "Property", "RoomType", "Profile"],
  endpoints: () => ({}),
});
