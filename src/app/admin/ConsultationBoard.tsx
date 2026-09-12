"use client";

import { useEffect, useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { Alert, App, Badge, Button, Card, DatePicker, Input, Layout, Table, Tabs, Typography } from "antd";
import type { TableColumnsType } from "antd";
import { LogoutOutlined, ReloadOutlined } from "@ant-design/icons";
import type { Consultation } from "@/generated/prisma/client";
import type { ConsultationStatus } from "@/generated/prisma/enums";
import { STATUS_LABEL, formatPhoneDisplay, preferredTimeLabel } from "@/lib/consultation";
import { signOut } from "./login/actions";
import { updateStatus } from "./actions";
import { ConsultationDrawer } from "./ConsultationDrawer";
import { StatusSelect } from "./StatusSelect";
import {
  PAGE_SIZE,
  POLL_MS,
  STATUSES,
  defaultFrom,
  filtersToHref,
  formatKst,
  kstToday,
  type AdminFilters,
  type TabKey,
} from "./shared";

type Props = {
  email: string;
  filters: AdminFilters;
  rows: Consultation[];
  counts: Record<ConsultationStatus, number>;
  allCount: number;
  spamCount: number;
  /** 지금 탭의 전체 건수 (쪽 나누기용) */
  tabTotal: number;
  /** 확인하지 않은 신규 (기간·검색과 무관) */
  newCount: number;
  fetchedAt: string;
};

const empty = <span className="text-neutral-300">-</span>;

function TabLabel({ text, count, alert = false }: { text: string; count: number; alert?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {text}
      <Badge
        count={count}
        showZero
        overflowCount={9999}
        styles={{ indicator: alert && count > 0 ? undefined : { background: "#f2f1ed", color: "#55554f", boxShadow: "none" } }}
      />
    </span>
  );
}

export function ConsultationBoard({ email, filters, rows, counts, allCount, spamCount, tabTotal, newCount, fetchedAt }: Props) {
  const router = useRouter();
  const { message } = App.useApp();
  const [navigating, startNav] = useTransition();
  const [, startSave] = useTransition();
  const [shownRows, setRowStatus] = useOptimistic(rows, (state, next: { id: string; status: ConsultationStatus }) =>
    state.map((r) => (r.id === next.id ? { ...r, status: next.status } : r)),
  );
  const [selected, setSelected] = useState<Consultation | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 60초마다 목록·신규 건수를 다시 불러온다 (PRD AR-02-3)
  useEffect(() => {
    const timer = setInterval(() => router.refresh(), POLL_MS);
    return () => clearInterval(timer);
  }, [router]);

  const go = (patch: Partial<AdminFilters>) =>
    startNav(() => router.push(filtersToHref({ ...filters, page: 1, ...patch }), { scroll: false }));

  const changeStatus = (id: string, status: ConsultationStatus) =>
    startSave(async () => {
      setRowStatus({ id, status });
      try {
        await updateStatus(id, status);
        message.success(`'${STATUS_LABEL[status]}' 상태로 저장했습니다.`);
      } catch {
        message.error("저장하지 못했습니다. 다시 시도해 주세요.");
      }
    });

  const today = dayjs(kstToday());
  const isDefault = filters.tab === "ALL" && !filters.q && filters.to === kstToday() && filters.from === defaultFrom(kstToday());
  const firstNo = tabTotal - (filters.page - 1) * PAGE_SIZE;

  const columns: TableColumnsType<Consultation> = [
    { title: "NO", key: "no", width: 72, align: "center", render: (_, __, i) => firstNo - i },
    {
      title: "상태",
      dataIndex: "status",
      width: 132,
      // 칸 클릭이 줄 클릭(상세 열기)으로 번지지 않게 막음
      render: (status: ConsultationStatus, r) => (
        <div onClick={(e) => e.stopPropagation()}>
          <StatusSelect size="small" value={status} onChange={(v) => changeStatus(r.id, v)} className="w-[104px]" />
        </div>
      ),
    },
    { title: "성함", dataIndex: "name", width: 110, render: (v: string) => <span className="font-semibold">{v}</span> },
    {
      title: "연락처",
      dataIndex: "phone",
      width: 140,
      render: (v: string) => (
        <a href={`tel:${v}`} onClick={(e) => e.stopPropagation()} className="text-brand">
          {formatPhoneDisplay(v)}
        </a>
      ),
    },
    { title: "상담 분야", dataIndex: "category", width: 130 },
    { title: "희망 시간", dataIndex: "preferredTime", width: 150, render: (v: string | null) => preferredTimeLabel(v) },
    { title: "문의 내용", dataIndex: "content", ellipsis: true, render: (v: string | null) => v ?? empty },
    { title: "메모", dataIndex: "memo", width: 180, ellipsis: true, render: (v: string | null) => v ?? empty },
    { title: "신청일시", dataIndex: "createdAt", width: 150, render: (v: Date) => formatKst(v) },
  ];

  const tabItems = [
    { key: "ALL", label: <TabLabel text="전체" count={allCount} /> },
    ...STATUSES.map((s) => ({ key: s, label: <TabLabel text={STATUS_LABEL[s]} count={counts[s]} alert={s === "NEW"} /> })),
    { key: "SPAM", label: <TabLabel text="스팸" count={spamCount} /> },
  ];

  const current = selected ? (shownRows.find((r) => r.id === selected.id) ?? selected) : null;

  return (
    <Layout className="flex-1">
      <Layout.Header className="flex items-center justify-between border-b border-line">
        <span className="text-lg font-bold text-brand">한결한의원 · 상담 관리</span>
        <form action={signOut} className="flex items-center gap-3">
          <Typography.Text type="secondary">{email}</Typography.Text>
          <Button htmlType="submit" icon={<LogoutOutlined />}>
            로그아웃
          </Button>
        </form>
      </Layout.Header>

      <Layout.Content className="px-6 py-6">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4">
          {/* 확인하지 않은 신규 상담 — 1건 이상이면 붉은 배너 (PRD AR-02-1) */}
          {newCount > 0 ? (
            <Alert
              type="error"
              showIcon
              title={<span className="text-lg font-bold">확인하지 않은 신규 상담 {newCount}건</span>}
              action={
                <Button danger onClick={() => go({ tab: "NEW", from: null, to: null, q: "" })}>
                  신규만 보기
                </Button>
              }
              className="py-4"
            />
          ) : (
            <Alert type="success" showIcon title="확인하지 않은 신규 상담이 없습니다." />
          )}

          <Card variant="outlined" styles={{ body: { paddingTop: 8 } }}>
            <Tabs activeKey={filters.tab} onChange={(k) => go({ tab: k as TabKey })} items={tabItems} />

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <DatePicker.RangePicker
                  value={filters.from && filters.to ? [dayjs(filters.from), dayjs(filters.to)] : null}
                  onChange={(v) =>
                    go(
                      v?.[0] && v?.[1]
                        ? { from: v[0].format("YYYY-MM-DD"), to: v[1].format("YYYY-MM-DD") }
                        : { from: null, to: null },
                    )
                  }
                  presets={[
                    { label: "오늘", value: [today, today] },
                    { label: "최근 7일", value: [today.subtract(6, "day"), today] },
                    { label: "최근 1개월", value: [today.subtract(1, "month"), today] },
                    { label: "최근 3개월", value: [today.subtract(3, "month"), today] },
                  ]}
                  placeholder={["전체 기간", "전체 기간"]}
                  allowClear
                />
                <Input.Search
                  key={filters.q}
                  defaultValue={filters.q}
                  placeholder="이름 또는 연락처"
                  allowClear
                  enterButton="조회"
                  onSearch={(v) => go({ q: v.trim() })}
                  className="w-72"
                />
                {!isDefault && <Button onClick={() => startNav(() => router.push("/admin", { scroll: false }))}>초기화</Button>}
              </div>

              <div className="flex items-center gap-2">
                <Typography.Text type="secondary" className="text-xs">
                  60초마다 자동 갱신 · 마지막 확인 {formatKst(fetchedAt).slice(11)}
                </Typography.Text>
                <Button icon={<ReloadOutlined />} onClick={() => startNav(() => router.refresh())}>
                  새로고침
                </Button>
              </div>
            </div>

            <Table<Consultation>
              rowKey="id"
              size="middle"
              columns={columns}
              dataSource={shownRows}
              loading={navigating}
              scroll={{ x: 1280 }}
              // 신규는 줄 배경 강조 (PRD AR-02-6)
              rowClassName={(r) => (r.status === "NEW" ? "cursor-pointer [&>td]:bg-red-50 hover:[&>td]:bg-red-100" : "cursor-pointer")}
              onRow={(r) => ({
                onClick: () => {
                  setSelected(r);
                  setDrawerOpen(true);
                },
              })}
              pagination={{
                current: filters.page,
                pageSize: PAGE_SIZE,
                total: tabTotal,
                showSizeChanger: false,
                showTotal: (t) => `총 ${t.toLocaleString()}건`,
                onChange: (page) => go({ page }),
              }}
              locale={{ emptyText: "신청 내역이 없습니다." }}
            />
          </Card>
        </div>
      </Layout.Content>

      <ConsultationDrawer record={current} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </Layout>
  );
}
