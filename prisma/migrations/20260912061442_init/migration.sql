-- CreateEnum
CREATE TYPE "ConsultationStatus" AS ENUM ('PENDING', 'CONTACTED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "consultations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "symptom" TEXT,
    "preferred_time" TEXT,
    "privacy_agreed" BOOLEAN NOT NULL DEFAULT true,
    "status" "ConsultationStatus" NOT NULL DEFAULT 'PENDING',
    "memo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "consultations_status_created_at_idx" ON "consultations"("status", "created_at");
