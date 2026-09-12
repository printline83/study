import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { MIN_FILL_MS, RATE_LIMIT, looksLikeSpam, validateConsultation } from "@/lib/consultation";

// 응답 형식: PRD §6 AJAX 응답 규격 { result, code, message, field? }
function reply(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status });
}

const clip = (v: unknown, max: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);

function clientIp(req: NextRequest) {
  const fwd = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || req.headers.get("x-real-ip")?.trim() || null;
}

export async function POST(req: NextRequest) {
  // SEC-04: 다른 사이트에서 보낸 요청은 받지 않음
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host")) {
    return reply(403, { result: false, code: "FORBIDDEN", message: "잘못된 요청입니다." });
  }

  let body: Record<string, unknown>;
  try {
    const parsed = await req.json();
    if (!parsed || typeof parsed !== "object") throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return reply(400, { result: false, code: "BAD_REQUEST", message: "잘못된 요청입니다." });
  }

  // SEC-01 허니팟 / SEC-02 제출 속도 → 봇으로 보고 성공 응답만, 저장하지 않음
  const honeypot = typeof body.website === "string" && body.website.trim() !== "";
  const tooFast = typeof body.elapsedMs !== "number" || body.elapsedMs < MIN_FILL_MS;
  if (honeypot || tooFast) {
    return reply(201, { result: true, code: "OK", message: "상담 신청이 접수되었습니다." });
  }

  // FR-01-2: 화면과 같은 규칙으로 서버에서도 검증
  const checked = validateConsultation(body);
  if (!checked.ok) {
    return reply(400, {
      result: false,
      code: "VALIDATION",
      field: checked.field,
      message: checked.message,
      errors: checked.errors,
    });
  }

  const ip = clientIp(req);

  // SEC-03: 같은 IP 10분 내 3건 초과 차단
  if (ip) {
    const recent = await prisma.consultation.count({
      where: { ip, createdAt: { gte: new Date(Date.now() - RATE_LIMIT.windowMs) } },
    });
    if (recent >= RATE_LIMIT.max) {
      return reply(429, {
        result: false,
        code: "RATE_LIMIT",
        message: "짧은 시간에 신청이 많아 잠시 제한되었습니다. 급하신 경우 전화로 문의해 주세요.",
      });
    }
  }

  const { data } = checked;
  await prisma.consultation.create({
    data: {
      ...data,
      isSpam: looksLikeSpam(data.name, data.content), // SEC-05: 차단 대신 표시만
      referrer: clip(body.referrer, 255), // FR-01-6 유입 정보
      utmSource: clip(body.utmSource, 100),
      utmMedium: clip(body.utmMedium, 100),
      utmCampaign: clip(body.utmCampaign, 100),
      ip,
      userAgent: clip(req.headers.get("user-agent"), 255),
    },
    select: { id: true },
  });

  return reply(201, { result: true, code: "OK", message: "상담 신청이 접수되었습니다." });
}
