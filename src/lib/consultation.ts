// 상담 신청 공통 규칙 — 화면(클라이언트)과 서버가 같은 함수로 검증한다 (PRD FR-01-2)

/** 상담 분야 = 랜딩 '이런 증상이라면' 항목 + 기타 (PRD F-01) */
export const CATEGORIES = [
  "허리·목 통증",
  "교통사고 후유증",
  "만성피로·면역",
  "소화기 질환",
  "산후·부인과",
  "수면·두통",
  "기타",
] as const;

export const PREFERRED_TIMES = [
  { value: "아무때나", label: "아무때나" },
  { value: "오전", label: "오전 (09:30-12:30)" },
  { value: "오후", label: "오후 (14:00-17:00)" },
  { value: "저녁", label: "저녁 (17:00-19:30)" },
] as const;

export const CONTENT_MAX = 1000;
/** 관리자 메모 최대 글자 수 */
export const MEMO_MAX = 1000;
/** SEC-02: 폼이 뜬 뒤 이 시간 안에 제출되면 봇으로 본다 */
export const MIN_FILL_MS = 3000;
/** SEC-03: 같은 IP 10분 내 3건 초과 차단 */
export const RATE_LIMIT = { max: 3, windowMs: 10 * 60 * 1000 } as const;

export type Field = "name" | "phone" | "category" | "content" | "agree";
export const FIELD_ORDER: Field[] = ["name", "phone", "category", "content", "agree"];
export type FieldErrors = Partial<Record<Field, string>>;

export type ConsultationData = {
  name: string;
  phone: string; // 숫자만
  category: string;
  content: string | null;
  preferredTime: string;
  privacyAgreed: true;
};

export type ValidationResult =
  | { ok: true; data: ConsultationData }
  | { ok: false; errors: FieldErrors; field: Field; message: string };

const str = (v: unknown) => (typeof v === "string" ? v : "");

export function validateConsultation(input: Record<string, unknown>): ValidationResult {
  const name = str(input.name).trim();
  const phone = str(input.phone).replace(/\D/g, "");
  const category = str(input.category);
  const content = str(input.content).trim();
  const preferredTime = str(input.preferredTime);
  const agree = input.privacyAgreed === true;

  const errors: FieldErrors = {};
  if (!name) errors.name = "성함을 입력해 주세요.";
  else if (!/^[가-힣a-zA-Z\s]{2,20}$/.test(name)) errors.name = "2~20자의 한글 또는 영문으로 입력해 주세요.";
  if (!phone) errors.phone = "연락처를 입력해 주세요.";
  else if (phone.length < 10 || phone.length > 11) errors.phone = "올바른 연락처를 입력해 주세요.";
  if (!(CATEGORIES as readonly string[]).includes(category)) errors.category = "상담 분야를 선택해 주세요.";
  if (content.length > CONTENT_MAX) errors.content = `문의 내용은 ${CONTENT_MAX}자 이내로 입력해 주세요.`;
  if (!agree) errors.agree = "개인정보 수집·이용에 동의해 주세요.";

  const field = FIELD_ORDER.find((k) => errors[k]);
  if (field) return { ok: false, errors, field, message: errors[field]! };

  return {
    ok: true,
    data: {
      name,
      phone,
      category,
      content: content || null,
      preferredTime: PREFERRED_TIMES.some((t) => t.value === preferredTime) ? preferredTime : "아무때나",
      privacyAgreed: true,
    },
  };
}

/** SEC-05: URL·광고성 키워드가 있으면 차단 대신 스팸 표시만 한다 */
const SPAM_PATTERN = /(https?:\/\/|www\.|카지노|바카라|토토|도박|대출|성인)/i;
export function looksLikeSpam(...texts: (string | null | undefined)[]) {
  return texts.some((t) => !!t && SPAM_PATTERN.test(t));
}

/** 입력 중 자동 하이픈 (디자인 정본 formatPhone 과 동일) */
export function formatPhoneInput(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, d.length - 4)}-${d.slice(d.length - 4)}`;
}

/** 관리자 화면 표시용 (02 지역번호 포함) */
export function formatPhoneDisplay(p: string) {
  if (p.startsWith("02")) return p.replace(/^(02)(\d{3,4})(\d{4})$/, "$1-$2-$3");
  return p.replace(/^(\d{3})(\d{3,4})(\d{4})$/, "$1-$2-$3");
}

/** 처리 상태 (PRD AR-03-2) */
export const STATUS_LABEL: Record<string, string> = {
  NEW: "신규",
  CONTACTING: "연락중",
  DONE: "완료",
  ABSENT: "부재중",
  HOLD: "보류",
};

export function preferredTimeLabel(v: string | null) {
  if (!v) return "-";
  return PREFERRED_TIMES.find((t) => t.value === v)?.label ?? v;
}
