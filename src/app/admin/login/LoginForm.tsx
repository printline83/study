"use client";

import { useState, useTransition } from "react";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { signIn } from "./actions";

type Values = { email: string; password: string };

export function LoginForm() {
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  const onFinish = (values: Values) =>
    startTransition(async () => {
      setError(undefined);
      const result = await signIn(values);
      if (result?.error) setError(result.error);
    });

  return (
    <Card className="w-full max-w-sm shadow-sm">
      <Typography.Title level={4} className="mb-1 text-brand">
        관리자 로그인
      </Typography.Title>
      <Typography.Text type="secondary">한결한의원 상담 관리</Typography.Text>

      <Form<Values> layout="vertical" requiredMark={false} onFinish={onFinish} disabled={pending} className="mt-6">
        <Form.Item
          name="email"
          label="이메일"
          rules={[
            { required: true, message: "이메일을 입력해 주세요." },
            { type: "email", message: "이메일 형식으로 입력해 주세요." },
          ]}
        >
          <Input size="large" prefix={<MailOutlined />} autoComplete="username" />
        </Form.Item>
        <Form.Item name="password" label="비밀번호" rules={[{ required: true, message: "비밀번호를 입력해 주세요." }]}>
          <Input.Password size="large" prefix={<LockOutlined />} autoComplete="current-password" />
        </Form.Item>

        {error && <Alert type="error" showIcon title={error} className="mb-4" />}

        <Button type="primary" htmlType="submit" size="large" block loading={pending}>
          로그인
        </Button>
      </Form>
    </Card>
  );
}
