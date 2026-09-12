"use client";

import { useEffect, useRef, useState } from "react";

export function CopyAddressButton({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(address).catch(() => {});
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 1800);
      }}
      className="h-[46px] cursor-pointer rounded-full border border-line-strong bg-white px-5 text-[14.5px] font-semibold hover:border-ink"
    >
      {copied ? "주소 복사됨" : "주소 복사"}
    </button>
  );
}
