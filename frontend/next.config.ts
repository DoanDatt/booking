import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Không bật cacheComponents: antd gọi Date.now() / Math.random() lúc render
  // (style cache trong @ant-design/cssinjs-utils), chế độ đó coi là lỗi prerender.
  // Xem lại khi nâng Next 17 (dự kiến bật bắt buộc) hoặc khi antd sửa.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
