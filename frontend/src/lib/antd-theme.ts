import type { ThemeConfig } from "antd";

// Màu lấy từ bảng màu Jadoo trong globals.css để antd và landing cùng tông.
export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: "#df6951",
    colorWarning: "#f1a501",
    colorInfo: "#6246e5",
    colorTextHeading: "#1e1d4c",
    colorText: "#212832",
    colorTextSecondary: "#5e6282",
    fontFamily: "var(--font-poppins), Arial, Helvetica, sans-serif",
    borderRadius: 10,
  },
  components: {
    Button: {
      primaryShadow: "0 12px 24px -8px rgba(223, 105, 81, 0.45)",
    },
  },
};
