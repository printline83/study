// 관리자 화면 공용 — 서버(page)와 브라우저(목록·상세)가 같은 규칙을 쓴다
import dayjs from "dayjs";
import { ConsultationStatus } from "@/generated/prisma/enums";

/** 페이지당 건수 (PRD AR-02-4) */
export const PAGE_SIZE = 20;
/** 자동 새로고침 간격 (PRD AR-02-3) */
export const POLL_MS = 60_000;

export const STATUSES = Object.values(ConsultationStatus);

export const isStatus = (v: unknown): v is ConsultationStatus =>
  typeof v === "string" && Object.hasOwn(ConsultationStatus, v);

/** 상태 점 색 (antd Badge) */
export const STATUS_DOT: Record<ConsultationStatus, "error" | "warning" | "success" | "default" | "processing"> = {
  NEW: "error",
  CONTACTING: "warning",
  DONE: "success",
  ABSENT: "default",
  HOLD: "processing",
};

export type TabKey = "ALL" | ConsultationStatus | "SPAM";

/** from·to 가 null 이면 전체 기간 */
export type AdminFilters = { tab: TabKey; from: string | null; to: string | null; q: string; page: number };

const pad = (n: number) => String(n).padStart(2, "0");

/** 한국 시각 표시 — 서버·브라우저의 시간대와 상관없이 같은 글자가 나오도록 직접 계산 */
export function formatKst(value: Date | string, withTime = true) {
  const k = new Date(new Date(value).getTime() + 9 * 60 * 60 * 1000);
  const date = `${k.getUTCFullYear()}-${pad(k.getUTCMonth() + 1)}-${pad(k.getUTCDate())}`;
  return withTime ? `${date} ${pad(k.getUTCHours())}:${pad(k.getUTCMinutes())}` : date;
}

export const kstToday = () => formatKst(new Date(), false);
export const defaultFrom = (today: string) => dayjs(today).subtract(1, "month").format("YYYY-MM-DD");

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

/** 주소 뒤 조건 → 필터. 기간을 안 정했으면 최근 1개월 (PRD AR-02-5) */
export function parseFilters(sp: Record<string, string | string[] | undefined>): AdminFilters {
  const status = one(sp.status);
  const tab: TabKey = status === "SPAM" || isStatus(status) ? status : "ALL";

  const today = kstToday();
  let from: string | null = null;
  let to: string | null = null;
  if (one(sp.period) !== "all") {
    from = DATE_RE.test(one(sp.from)) ? one(sp.from) : defaultFrom(today);
    to = DATE_RE.test(one(sp.to)) ? one(sp.to) : today;
    if (from > to) [from, to] = [to, from];
  }

  const q = one(sp.q).trim().slice(0, 50);
  const page = Math.max(1, Number.parseInt(one(sp.page), 10) || 1);
  return { tab, from, to, q, page };
}

/** 필터 → 주소 */
export function filtersToHref(f: AdminFilters) {
  const p = new URLSearchParams();
  if (f.tab !== "ALL") p.set("status", f.tab);
  if (f.from && f.to) {
    p.set("from", f.from);
    p.set("to", f.to);
  } else {
    p.set("period", "all");
  }
  if (f.q) p.set("q", f.q);
  if (f.page > 1) p.set("page", String(f.page));
  return `/admin?${p}`;
}
