import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  const allow = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return allow.includes(email.toLowerCase());
}

/** 관리자 페이지 진입 시 호출. 미로그인/비허용 계정은 로그인 화면으로 보냄 */
export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) redirect("/admin/login");
  return user;
}
