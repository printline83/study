"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ConsultationStatus } from "@/generated/prisma/enums";

export async function updateConsultation(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const memo = String(formData.get("memo") ?? "").trim();

  if (!id || !(status in ConsultationStatus)) return;

  await prisma.consultation.update({
    where: { id },
    data: { status: status as ConsultationStatus, memo: memo || null },
  });
  revalidatePath("/admin");
}
