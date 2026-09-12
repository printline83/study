"use client";

import { App, ConfigProvider, type ThemeConfig } from "antd";
import koKR from "antd/locale/ko_KR";
import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

// 디자인 정본(globals.css) 색·글꼴을 antd 에 맞춤
const theme: ThemeConfig = {
  token: {
    colorPrimary: "#2f5d4a",
    colorLink: "#2f5d4a",
    colorText: "#101010",
    colorBorderSecondary: "#eceae5",
    colorBgLayout: "#f5f4f0",
    borderRadius: 8,
    fontFamily: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  },
  components: {
    Layout: { headerBg: "#ffffff", headerHeight: 60, headerPadding: "0 24px" },
    Table: { headerBg: "#fafaf8" },
  },
};

export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider locale={koKR} theme={theme}>
      <App className="flex flex-1 flex-col">{children}</App>
    </ConfigProvider>
  );
}
