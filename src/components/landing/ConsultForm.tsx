"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  CATEGORIES,
  CONTENT_MAX,
  MIN_FILL_MS,
  PREFERRED_TIMES,
  formatPhoneInput,
  validateConsultation,
  type Field,
  type FieldErrors,
} from "@/lib/consultation";
import { Overlay } from "./Overlay";
import { PrivacyButton } from "./Privacy";

const label = "mb-[7px] block text-[13.5px] text-[#b8b8b2]";
const control =
  "w-full rounded-xl border border-[#33332f] bg-[#1a1a18] text-[15px] text-white outline-none placeholder:text-[#757575] focus:border-white";

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <div id={id} className="mt-[7px] text-[13px] text-[#ff9d8a]">
      {message}
    </div>
  );
}

export function ConsultForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [chars, setChars] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const mountedAt = useRef(0);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const agreeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  function focusField(field: Field) {
    const map = { name: nameRef, phone: phoneRef, category: categoryRef, content: contentRef, agree: agreeRef };
    map[field].current?.focus();
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      category: String(fd.get("category") ?? ""),
      preferredTime: String(fd.get("preferredTime") ?? ""),
      content: String(fd.get("content") ?? ""),
      privacyAgreed: fd.get("agree") === "on",
    };

    // FR-01-1: 인라인 오류 + 첫 오류 칸으로 이동
    const checked = validateConsultation(payload);
    setFormError("");
    if (!checked.ok) {
      setErrors(checked.errors);
      focusField(checked.field);
      return;
    }
    setErrors({});

    // SEC-02: 너무 빨리 제출되면 봇으로 보고 조용히 무시 (디자인 정본 동작)
    const elapsedMs = Date.now() - mountedAt.current;
    if (elapsedMs < MIN_FILL_MS) return;

    setSubmitting(true); // FR-01-3: 중복 제출 차단
    try {
      const params = new URLSearchParams(window.location.search);
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          website: String(fd.get("website") ?? ""),
          elapsedMs,
          referrer: document.referrer || null,
          utmSource: params.get("utm_source"),
          utmMedium: params.get("utm_medium"),
          utmCampaign: params.get("utm_campaign"),
        }),
      });
      const json = await res.json().catch(() => null);

      if (res.ok && json?.result) {
        form.reset();
        setChars(0);
        setDone(true);
      } else if (json?.errors && json?.field) {
        setErrors(json.errors);
        focusField(json.field);
      } else {
        // FR-01-5: 입력값은 그대로 두고 안내만
        setFormError(json?.message ?? "잠시 후 다시 시도해 주세요.");
      }
    } catch {
      setFormError("연결이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  const invalid = (f: Field) => (errors[f] ? { "aria-invalid": true, "aria-describedby": `err-${f}` } : {});

  return (
    <>
      <form onSubmit={onSubmit} noValidate className="grid gap-3.5">
        {/* SEC-01 허니팟: 사람 눈에는 안 보이는 칸 */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] size-px opacity-0"
        />

        <div>
          <label htmlFor="cf-name" className={label}>
            성함 *
          </label>
          <input
            id="cf-name"
            ref={nameRef}
            name="name"
            type="text"
            placeholder="홍길동"
            autoComplete="name"
            className={`${control} h-[50px] px-4`}
            {...invalid("name")}
          />
          <ErrorText id="err-name" message={errors.name} />
        </div>

        <div>
          <label htmlFor="cf-phone" className={label}>
            연락처 *
          </label>
          <input
            id="cf-phone"
            ref={phoneRef}
            name="phone"
            type="tel"
            inputMode="numeric"
            placeholder="010-0000-0000"
            autoComplete="tel"
            onInput={(e) => {
              e.currentTarget.value = formatPhoneInput(e.currentTarget.value);
            }}
            className={`${control} h-[50px] px-4`}
            {...invalid("phone")}
          />
          <ErrorText id="err-phone" message={errors.phone} />
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(150px,100%),1fr))] gap-3.5">
          <div>
            <label htmlFor="cf-category" className={label}>
              상담 분야 *
            </label>
            <select
              id="cf-category"
              ref={categoryRef}
              name="category"
              defaultValue=""
              className={`${control} h-[50px] px-3`}
              {...invalid("category")}
            >
              <option value="">선택해 주세요</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ErrorText id="err-category" message={errors.category} />
          </div>
          <div>
            <label htmlFor="cf-time" className={label}>
              연락 희망 시간대
            </label>
            <select
              id="cf-time"
              name="preferredTime"
              defaultValue={PREFERRED_TIMES[0].value}
              className={`${control} h-[50px] px-3`}
            >
              {PREFERRED_TIMES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="mb-[7px] flex justify-between text-[13.5px] text-[#b8b8b2]">
            <label htmlFor="cf-content">문의 내용</label>
            <span>
              {chars} / {CONTENT_MAX}
            </span>
          </div>
          <textarea
            id="cf-content"
            ref={contentRef}
            name="content"
            rows={4}
            maxLength={CONTENT_MAX}
            placeholder="언제부터 어떤 증상이 있으신지 적어주시면 상담에 도움이 됩니다."
            onInput={(e) => setChars(e.currentTarget.value.length)}
            className={`${control} resize-y px-4 py-3.5 leading-[1.6]`}
            {...invalid("content")}
          />
          <ErrorText id="err-content" message={errors.content} />
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-2.5 text-[13.5px] leading-[1.55] text-[#b8b8b2]">
            <input
              ref={agreeRef}
              name="agree"
              type="checkbox"
              className="mt-px size-[18px] flex-none accent-white"
              {...invalid("agree")}
            />
            <span>
              개인정보 수집·이용에 동의합니다. 수집 항목: 성함, 연락처, 상담 내용 / 목적: 상담 문의 회신 /
              보유기간: 상담 완료 후 6개월.{" "}
              <PrivacyButton className="cursor-pointer bg-transparent p-0 text-[13.5px] text-white underline">
                전문 보기
              </PrivacyButton>
            </span>
          </label>
          <ErrorText id="err-agree" message={errors.agree} />
        </div>

        {formError && (
          <div role="alert" className="text-[13px] text-[#ff9d8a]">
            {formError}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 h-[54px] cursor-pointer rounded-full bg-white text-[15.5px] font-bold text-ink hover:bg-[#e6e6e0] disabled:cursor-wait"
        >
          {submitting ? "접수 중…" : "상담 신청하기"}
        </button>
      </form>

      {done && (
        <Overlay
          onClose={() => setDone(false)}
          className="z-[90] animate-rise"
          labelledBy="done-title"
          panelClassName="w-full max-w-[420px] rounded-[22px] bg-white px-[30px] pt-9 pb-[30px] text-center text-ink"
        >
          <div className="mx-auto flex size-[52px] items-center justify-center rounded-full bg-sage text-[22px] text-brand">
            ✓
          </div>
          <div id="done-title" className="mt-5 text-[21px] font-bold tracking-[-0.025em]">
            상담 신청이 접수되었습니다
          </div>
          <div className="mt-3 text-[14.5px] leading-[1.65] text-sub">진료시간 내 순차적으로 연락드리겠습니다.</div>
          <button
            type="button"
            autoFocus
            onClick={() => setDone(false)}
            className="mt-6 h-[50px] w-full cursor-pointer rounded-full bg-ink text-[15px] font-semibold text-white"
          >
            확인
          </button>
        </Overlay>
      )}
    </>
  );
}
