import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AdminProviders } from "./AdminProviders";

// antd 는 관리자 화면에서만 불러온다 — 랜딩은 영향 없음.
// layer: antd 디자인 규칙을 Tailwind 아래 층에 둔다 (순서는 globals.css 첫 줄)
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <AntdRegistry layer>
      <AdminProviders>{children}</AdminProviders>
    </AntdRegistry>
  );
}
