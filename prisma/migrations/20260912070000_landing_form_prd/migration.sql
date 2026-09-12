-- 디자인 정본 + PRD §5.1 에 맞춘 상담 신청 구조 변경 (기존 데이터 보존)

-- 1) 처리 상태를 PRD 기준(신규/연락중/완료/부재중/보류)으로 교체
ALTER TYPE "ConsultationStatus" RENAME TO "ConsultationStatus_old";
CREATE TYPE "ConsultationStatus" AS ENUM ('NEW', 'CONTACTING', 'DONE', 'ABSENT', 'HOLD');
ALTER TABLE "consultations" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "consultations" ALTER COLUMN "status" TYPE "ConsultationStatus" USING (
  CASE "status"::text
    WHEN 'PENDING'   THEN 'NEW'
    WHEN 'CONTACTED' THEN 'CONTACTING'
    WHEN 'COMPLETED' THEN 'DONE'
    ELSE 'HOLD'
  END
)::"ConsultationStatus";
ALTER TABLE "consultations" ALTER COLUMN "status" SET DEFAULT 'NEW';
DROP TYPE "ConsultationStatus_old";

-- 2) 문의 내용: symptom → content (값 유지)
ALTER TABLE "consultations" RENAME COLUMN "symptom" TO "content";

-- 3) 상담 분야(필수): 기존 행은 '기타'로 채운 뒤 기본값 제거
ALTER TABLE "consultations" ADD COLUMN "category" TEXT NOT NULL DEFAULT '기타';
ALTER TABLE "consultations" ALTER COLUMN "category" DROP DEFAULT;

-- 4) 스팸 표시 + 유입 정보
ALTER TABLE "consultations"
  ADD COLUMN "is_spam"      BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "referrer"     TEXT,
  ADD COLUMN "utm_source"   TEXT,
  ADD COLUMN "utm_medium"   TEXT,
  ADD COLUMN "utm_campaign" TEXT,
  ADD COLUMN "ip"           TEXT,
  ADD COLUMN "user_agent"   TEXT;

-- 5) 조회용 인덱스 (IP 제출 제한 · 연락처 검색)
CREATE INDEX "consultations_ip_created_at_idx" ON "consultations"("ip", "created_at");
CREATE INDEX "consultations_phone_idx" ON "consultations"("phone");
