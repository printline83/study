"use client";

import { useEffect, type ReactNode } from "react";

/** 어두운 배경 + 가운데 카드. 배경 클릭·Esc 로 닫힘 */
export function Overlay({
  onClose,
  className = "",
  panelClassName = "",
  labelledBy,
  children,
}: {
  onClose: () => void;
  className?: string;
  panelClassName?: string;
  labelledBy?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex items-center justify-center bg-[rgba(16,16,16,0.5)] p-5 ${className}`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(e) => e.stopPropagation()}
        className={panelClassName}
      >
        {children}
      </div>
    </div>
  );
}
