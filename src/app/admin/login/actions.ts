"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth";

/** 성공하면 /admin 으로 이동, 실패하면 화면에 띄울 문구를 돌려준다 */
export async function signIn(input: { email: string; password: string }) {
  const email = String(input?.email ?? "").trim();
  const password = String(input?.password ?? "");

  if (!isAdminEmail(email)) return { error: "관리자로 등록되지 않은 계정입니다." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
