import type { Metadata } from "next";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import type { Prisma } from "@/generated/prisma/client";
import type { ConsultationStatus } from "@/generated/prisma/enums";
import { ConsultationBoard } from "./ConsultationBoard";
import { PAGE_SIZE, STATUSES, parseFilters, type AdminFilters } from "./shared";

export const dynamic = "force-dynamic";

// 제목·본문이 한 요청 안에서 로그인 확인·건수 조회를 한 번만 하도록 묶음
const getAdmin = cache(requireAdmin);
/** 확인하지 않은 신규 = 스팸이 아닌 '신규' 전체. 기간·검색과 무관 (PRD AR-02-1) */
const getNewCount = cache(() => prisma.consultation.count({ where: { status: "NEW", isSpam: false } }));

/** 탭 제목에 신규 건수 — 창을 켜둔 채로도 알 수 있게 (PRD AR-02-2) */
export async function generateMetadata(): Promise<Metadata> {
  await getAdmin();
  const n = await getNewCount();
  return { title: `${n > 0 ? `(${n}) ` : ""}상담 관리 | 한결한의원`, robots: { index: false, follow: false } };
}

/** 기간(한국 시각 하루 전체)·이름/연락처 검색 조건 */
function baseWhere(f: AdminFilters): Prisma.ConsultationWhereInput {
  const where: Prisma.ConsultationWhereInput = {};
  if (f.from && f.to) {
    where.createdAt = { gte: new Date(`${f.from}T00:00:00+09:00`), lte: new Date(`${f.to}T23:59:59.999+09:00`) };
  }
  if (f.q) {
    const digits = f.q.replace(/\D/g, "");
    where.OR = [{ name: { contains: f.q, mode: "insensitive" } }, ...(digits ? [{ phone: { contains: digits } }] : [])];
  }
  return where;
}

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  const user = await getAdmin();
  const filters = parseFilters(await searchParams);
  const base = baseWhere(filters);

  const [newCount, grouped, spamCount] = await Promise.all([
    getNewCount(),
    prisma.consultation.groupBy({ by: ["status"], where: { ...base, isSpam: false }, _count: { _all: true } }),
    prisma.consultation.count({ where: { ...base, isSpam: true } }),
  ]);
  const counts = Object.fromEntries(
    STATUSES.map((s) => [s, grouped.find((g) => g.status === s)?._count._all ?? 0]),
  ) as Record<ConsultationStatus, number>;
  const allCount = STATUSES.reduce((sum, s) => sum + counts[s], 0);

  const { tab } = filters;
  const tabTotal = tab === "ALL" ? allCount : tab === "SPAM" ? spamCount : counts[tab];
  const where: Prisma.ConsultationWhereInput =
    tab === "SPAM" ? { ...base, isSpam: true } : { ...base, isSpam: false, ...(tab === "ALL" ? {} : { status: tab }) };
  // 조건을 바꿔 쪽 수가 줄었으면 마지막 쪽으로
  const page = Math.min(filters.page, Math.max(1, Math.ceil(tabTotal / PAGE_SIZE)));

  const rows = await prisma.consultation.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return (
    <ConsultationBoard
      email={user.email ?? ""}
      filters={{ ...filters, page }}
      rows={rows}
      counts={counts}
      allCount={allCount}
      spamCount={spamCount}
      tabTotal={tabTotal}
      newCount={newCount}
      fetchedAt={new Date().toISOString()}
    />
  );
}
