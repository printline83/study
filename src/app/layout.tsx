import type { Metadata } from "next";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";

const title = "한결한의원 — 침·추나·한약 상담";
const description = "허리·목 통증, 교통사고 후유증, 만성피로. 한결한의원 상담 신청.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", locale: "ko_KR", siteName: "한결한의원" },
  twitter: { card: "summary", title, description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // suppressHydrationWarning: 브라우저 확장 프로그램이 body 에 붙이는 속성 경고만 끔
  return (
    <html lang="ko" className="h-full">
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
