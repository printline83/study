"use client";

import { useTransition } from "react";
import { App, Badge, Button, Descriptions, Drawer, Form, Input, Tag, Typography, type DescriptionsProps } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import type { Consultation } from "@/generated/prisma/client";
import type { ConsultationStatus } from "@/generated/prisma/enums";
import { MEMO_MAX, STATUS_LABEL, formatPhoneDisplay, preferredTimeLabel } from "@/lib/consultation";
import { updateConsultation } from "./actions";
import { StatusSelect } from "./StatusSelect";
import { STATUS_DOT, formatKst } from "./shared";

type Values = { status: ConsultationStatus; memo: string };

const empty = <span className="text-neutral-300">-</span>;

/** 접속 기기 대략 표시 (모바일·PC / 운영체제 / 브라우저) */
function deviceLabel(ua: string) {
  const kind = /Mobi|iPhone|Android/.test(ua) ? "모바일" : "PC";
  const os = /iPhone|iPad|iPod/.test(ua)
    ? "iOS"
    : /Android/.test(ua)
      ? "Android"
      : /Windows/.test(ua)
        ? "Windows"
        : /Macintosh|Mac OS X/.test(ua)
          ? "macOS"
          : "기타";
  const browser = /KAKAOTALK/i.test(ua)
    ? "카카오톡"
    : /NAVER\(inapp/i.test(ua)
      ? "네이버 앱"
      : /SamsungBrowser/.test(ua)
        ? "삼성 인터넷"
        : /Edg\//.test(ua)
          ? "Edge"
          : /CriOS|Chrome\//.test(ua)
            ? "Chrome"
            : /FxiOS|Firefox/.test(ua)
              ? "Firefox"
              : /Safari/.test(ua)
                ? "Safari"
                : "기타";
  return `${kind} · ${os} · ${browser}`;
}

/** 상담 상세 (PRD A-03) — 열기만 해서는 상태가 바뀌지 않는다 (AR-03-5) */
export function ConsultationDrawer({
  record,
  open,
  onClose,
}: {
  record: Consultation | null;
  open: boolean;
  onClose: () => void;
}) {
  const { message } = App.useApp();
  const [saving, startSave] = useTransition();

  if (!record) return null;

  const save = (values: Values) =>
    startSave(async () => {
      try {
        await updateConsultation(record.id, values);
        message.success("저장했습니다.");
      } catch {
        message.error("저장하지 못했습니다. 다시 시도해 주세요.");
      }
    });

  const applied: DescriptionsProps["items"] = [
    { key: "createdAt", label: "신청일시", children: formatKst(record.createdAt) },
    { key: "name", label: "성함", children: <span className="font-semibold">{record.name}</span> },
    {
      key: "phone",
      label: "연락처",
      children: (
        <span className="flex flex-wrap items-center gap-2">
          <a href={`tel:${record.phone}`} className="text-brand">
            {formatPhoneDisplay(record.phone)}
          </a>
          <Button size="small" icon={<PhoneOutlined />} href={`tel:${record.phone}`}>
            전화 걸기
          </Button>
        </span>
      ),
    },
    { key: "category", label: "상담 분야", children: record.category },
    { key: "preferredTime", label: "희망 시간", children: preferredTimeLabel(record.preferredTime) },
    {
      key: "content",
      label: "문의 내용",
      children: record.content ? <div className="whitespace-pre-wrap">{record.content}</div> : empty,
    },
    { key: "privacy", label: "개인정보 동의", children: record.privacyAgreed ? "동의" : "미동의" },
    {
      key: "spam",
      label: "스팸 판정",
      children: record.isSpam ? <Tag color="red">스팸 의심</Tag> : "해당 없음",
    },
  ];

  const source: DescriptionsProps["items"] = [
    {
      key: "referrer",
      label: "들어온 경로",
      children: record.referrer ? (
        <Typography.Text className="break-all">{record.referrer}</Typography.Text>
      ) : (
        "직접 방문 또는 알 수 없음"
      ),
    },
    { key: "utmSource", label: "광고 출처", children: record.utmSource ?? empty },
    { key: "utmMedium", label: "광고 유형", children: record.utmMedium ?? empty },
    { key: "utmCampaign", label: "캠페인", children: record.utmCampaign ?? empty },
    {
      key: "device",
      label: "기기",
      children: record.userAgent ? (
        <div>
          <div>{deviceLabel(record.userAgent)}</div>
          <Typography.Text type="secondary" className="text-xs break-all">
            {record.userAgent}
          </Typography.Text>
        </div>
      ) : (
        empty
      ),
    },
    { key: "ip", label: "IP", children: record.ip ?? empty },
  ];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={560}
      title={`${record.name} 님 상담 신청`}
      extra={<Badge status={STATUS_DOT[record.status]} text={STATUS_LABEL[record.status]} />}
    >
      <Descriptions title="신청 내용" column={1} bordered size="small" items={applied} styles={{ label: { width: 120 } }} />
      <Descriptions
        title="유입 정보"
        column={1}
        bordered
        size="small"
        items={source}
        styles={{ label: { width: 120 } }}
        className="mt-6"
      />

      <Typography.Title level={5} className="mt-6">
        처리
      </Typography.Title>
      <Form<Values>
        key={record.id}
        layout="vertical"
        initialValues={{ status: record.status, memo: record.memo ?? "" }}
        onFinish={save}
        disabled={saving}
      >
        <Form.Item name="status" label="처리 상태">
          <StatusSelect className="w-40" />
        </Form.Item>
        <Form.Item name="memo" label="관리자 메모">
          <Input.TextArea rows={4} maxLength={MEMO_MAX} showCount placeholder="통화 결과 등을 적어 두세요." />
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={saving}>
          저장
        </Button>
      </Form>
    </Drawer>
  );
}
