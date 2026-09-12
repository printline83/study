import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "관리자 로그인 | 한결한의원", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-[#f5f4f0] px-4">
      <LoginForm />
    </main>
  );
}
