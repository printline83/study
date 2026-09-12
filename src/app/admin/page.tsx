import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { STATUS_LABEL, formatPhoneDisplay, preferredTimeLabel } from "@/lib/consultation";
import { ConsultationStatus } from "@/generated/prisma/enums";
import { updateConsultation } from "./actions";
import { signOut } from "./login/actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "상담 관리 | 한결한의원", robots: { index: false, follow: false } };

const STATUS_BADGE: Record<string, string> = {
  NEW: "bg-red-100 text-red-700",
  CONTACTING: "bg-amber-100 text-amber-800",
  DONE: "bg-green-100 text-green-800",
  ABSENT: "bg-neutral-200 text-neutral-700",
  HOLD: "bg-blue-100 text-blue-800",
};

const pill = (active: boolean) =>
  `rounded-full px-3 py-1 ${active ? "bg-brand text-white hover:text-white" : "bg-white ring-1 ring-neutral-200"}`;

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  const user = await requireAdmin();
  const { status } = await searchParams;
  const spamTab = status === "SPAM";
  const filter =
    typeof status === "string" && status in ConsultationStatus ? (status as ConsultationStatus) : undefined;

  const [items, counts, spamCount] = await Promise.all([
    prisma.consultation.findMany({
      where: spamTab ? { isSpam: true } : { isSpam: false, ...(filter ? { status: filter } : {}) },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.consultation.groupBy({ by: ["status"], where: { isSpam: false }, _count: { _all: true } }),
    prisma.consultation.count({ where: { isSpam: true } }),
  ]);
  const countOf = (s: string) => counts.find((c) => c.status === s)?._count._all ?? 0;
  const total = counts.reduce((a, c) => a + c._count._all, 0);

  return (
    <main className="flex-1 bg-neutral-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-brand">상담 신청 관리</h1>
          <form action={signOut} className="flex items-center gap-3 text-sm text-neutral-500">
            <span>{user.email}</span>
            <button className="rounded-md border px-3 py-1 hover:bg-neutral-100">로그아웃</button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <nav className="flex flex-wrap gap-2 text-sm">
          <a href="/admin" className={pill(!filter && !spamTab)}>
            전체 {total}
          </a>
          {Object.values(ConsultationStatus).map((s) => (
            <a key={s} href={`/admin?status=${s}`} className={pill(filter === s)}>
              {STATUS_LABEL[s]} {countOf(s)}
            </a>
          ))}
          <a href="/admin?status=SPAM" className={pill(spamTab)}>
            스팸 {spamCount}
          </a>
        </nav>

        <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-neutral-200">
          <table className="w-full min-w-[1040px] text-sm">
            <thead className="bg-neutral-50 text-left text-neutral-500">
              <tr>
                <th className="px-4 py-3">신청일시</th>
                <th className="px-4 py-3">성함</th>
                <th className="px-4 py-3">연락처</th>
                <th className="px-4 py-3">상담 분야</th>
                <th className="px-4 py-3">희망 시간</th>
                <th className="px-4 py-3">문의 내용</th>
                <th className="px-4 py-3">상태 · 메모</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-neutral-400">
                    신청 내역이 없습니다.
                  </td>
                </tr>
              )}
              {items.map((c) => (
                <tr key={c.id} className="align-top">
                  <td className="px-4 py-3 whitespace-nowrap text-neutral-500">
                    {c.createdAt.toLocaleString("ko-KR", { timeZone: "Asia/Seoul", dateStyle: "short", timeStyle: "short" })}
                  </td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{c.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <a href={`tel:${c.phone}`} className="text-brand underline-offset-2 hover:underline">
                      {formatPhoneDisplay(c.phone)}
                    </a>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{c.category}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{preferredTimeLabel(c.preferredTime)}</td>
                  <td className="max-w-xs px-4 py-3 whitespace-pre-wrap text-neutral-700">{c.content ?? "-"}</td>
                  <td className="px-4 py-3">
                    <form action={updateConsultation} className="flex items-start gap-2">
                      <input type="hidden" name="id" value={c.id} />
                      <select
                        name="status"
                        defaultValue={c.status}
                        className={`rounded-md px-2 py-1 text-xs font-semibold ${STATUS_BADGE[c.status]}`}
                      >
                        {Object.values(ConsultationStatus).map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABEL[s]}
                          </option>
                        ))}
                      </select>
                      <input name="memo" defaultValue={c.memo ?? ""} placeholder="관리자 메모" className="input py-1 text-xs" />
                      <button className="rounded-md bg-brand px-3 py-1 text-xs font-semibold whitespace-nowrap text-white hover:bg-brand-dark">
                        저장
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
