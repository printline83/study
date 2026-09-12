"use client";

import { Badge, Select, type SelectProps } from "antd";
import type { ConsultationStatus } from "@/generated/prisma/enums";
import { STATUS_LABEL } from "@/lib/consultation";
import { STATUSES, STATUS_DOT } from "./shared";

const OPTIONS = STATUSES.map((s) => ({ value: s, label: <Badge status={STATUS_DOT[s]} text={STATUS_LABEL[s]} /> }));

/** 처리 상태 선택칸 — 목록과 상세 창이 같이 쓴다 */
export function StatusSelect(props: SelectProps<ConsultationStatus>) {
  return <Select<ConsultationStatus> options={OPTIONS} popupMatchSelectWidth={false} {...props} />;
}
