import type { Metadata } from "next";
import { signIn } from "./actions";

export const metadata: Metadata = { title: "관리자 로그인 | 한결한의원", robots: { index: false, follow: false } };

const ERROR_MESSAGE: Record<string, string> = {
  invalid: "이메일 또는 비밀번호가 올바르지 않습니다.",
  notallowed: "관리자로 등록되지 않은 계정입니다.",
};

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { error } = await searchParams;
  const message = typeof error === "string" ? ERROR_MESSAGE[error] : undefined;

  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <form action={signIn} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-brand/10">
        <h1 className="text-xl font-bold text-brand">관리자 로그인</h1>
        <p className="mt-1 text-sm text-neutral-500">한결한의원 상담 관리</p>

        <label className="mt-6 grid gap-1 text-sm">
          <span className="font-medium">이메일</span>
          <input name="email" type="email" required autoComplete="username" className="input" />
        </label>
        <label className="mt-4 grid gap-1 text-sm">
          <span className="font-medium">비밀번호</span>
          <input name="password" type="password" required autoComplete="current-password" className="input" />
        </label>

        {message && <p className="mt-4 text-sm text-red-600">{message}</p>}

        <button type="submit" className="mt-6 w-full rounded-lg bg-brand py-2.5 font-semibold text-white hover:bg-brand-dark">
          로그인
        </button>
      </form>
    </main>
  );
}
