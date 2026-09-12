// 사용법: node --env-file=.env scripts/create-admin.mjs <email> <password>
import { createClient } from "@supabase/supabase-js";

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error("사용법: node --env-file=.env scripts/create-admin.mjs <email> <password>");
  process.exit(1);
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
if (error) {
  console.error("생성 실패:", error.message);
  process.exit(1);
}
console.log("관리자 계정 생성 완료:", data.user.email);
console.log(`.env 의 ADMIN_EMAILS 에 ${email} 이 포함돼 있어야 로그인됩니다.`);
