"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { PRIVACY_TERMS } from "@/content/clinic";
import { Overlay } from "./Overlay";

const OpenPrivacy = createContext<() => void>(() => {});

/** 상담폼 '전문 보기'와 푸터 '개인정보처리방침'이 같은 레이어를 연다 */
export function PrivacyProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);

  return (
    <OpenPrivacy.Provider value={show}>
      {children}
      {open && (
        <Overlay
          onClose={hide}
          className="z-[95]"
          labelledBy="privacy-title"
          panelClassName="w-full max-w-[520px] rounded-[22px] bg-white p-[30px]"
        >
          <div id="privacy-title" className="text-[19px] font-bold tracking-[-0.02em]">
            개인정보 수집·이용 동의
          </div>
          <div className="mt-4 text-[14px] leading-[1.75] text-muted">
            {PRIVACY_TERMS.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
          <button
            type="button"
            autoFocus
            onClick={hide}
            className="mt-[22px] h-12 w-full cursor-pointer rounded-full border border-line-strong bg-white text-[15px] font-semibold"
          >
            닫기
          </button>
        </Overlay>
      )}
    </OpenPrivacy.Provider>
  );
}

export function PrivacyButton({ className, children }: { className?: string; children: ReactNode }) {
  const open = useContext(OpenPrivacy);
  return (
    <button type="button" onClick={open} className={className}>
      {children}
    </button>
  );
}
