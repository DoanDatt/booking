"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { antdTheme } from "@/lib/antd-theme";
import { makeStore, type AppStore } from "@/lib/redux/store";

dayjs.locale("vi");

export function Providers({ children }: { children: React.ReactNode }) {
  // Truyền makeStore (không có dấu ()): React chỉ gọi nó ở lần render đầu
  const [store] = useState<AppStore>(makeStore);

  return (
    <Provider store={store}>
      {/* layer: bọc CSS của antd trong @layer antd để class Tailwind ghi đè được */}
      <AntdRegistry layer>
        <ConfigProvider theme={antdTheme} locale={viVN}>
          {/* <App> cho phép dùng App.useApp() -> message / notification / modal đúng theme.
              component={false}: không bọc thêm <div class="ant-app">, nếu không style
              `a { color: colorLink }` của antd sẽ nhuộm màu mọi link trên landing. */}
          <App component={false}>{children}</App>
        </ConfigProvider>
      </AntdRegistry>
    </Provider>
  );
}
