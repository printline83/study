import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** 개발환경 점검용: DB 연결 + 상담신청 건수 */
export async function GET() {
  try {
    const consultations = await prisma.consultation.count();
    return NextResponse.json({ ok: true, db: "connected", consultations });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
