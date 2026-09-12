"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { MEMO_MAX } from "@/lib/consultation";
import type { ConsultationStatus } from "@/generated/prisma/enums";
import { isStatus } from "./shared";

/** 목록에서 상태만 바로 저장 (PRD AR-02-7) */
export async function updateStatus(id: string, status: ConsultationStatus) {
  await requireAdmin();
  if (typeof id !== "string" || !id || !isStatus(status)) throw new Error("잘못된 요청입니다.");

  await prisma.consultation.update({ where: { id }, data: { status } });
  revalidatePath("/admin");
}

/** 상세 창에서 상태·메모 저장 (PRD AR-03-2·3) */
export async function updateConsultation(id: string, input: { status: ConsultationStatus; memo: string }) {
  await requireAdmin();
  const memo = String(input?.memo ?? "").trim();
  if (typeof id !== "string" || !id || !isStatus(input?.status) || memo.length > MEMO_MAX) {
    throw new Error("잘못된 요청입니다.");
  }

  await prisma.consultation.update({ where: { id }, data: { status: input.status, memo: memo || null } });
  revalidatePath("/admin");
}
