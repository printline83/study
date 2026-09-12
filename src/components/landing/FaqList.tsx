"use client";

import { useState } from "react";

/** 한 번에 하나만 펼쳐지는 질문 목록 */
export function FaqList({ items }: { items: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState(-1);

  return (
    <div className="mt-7 border-t border-line">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="border-b border-line">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-${i}`}
              onClick={() => setOpen((o) => (o === i ? -1 : i))}
              className="flex w-full cursor-pointer items-center justify-between gap-5 bg-transparent px-1 py-[22px] text-left"
            >
              <span className="text-[17px] font-semibold tracking-[-0.02em] text-ink">{f.q}</span>
              <span className="flex-none text-[20px] text-[#9a9a92]">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
              <div id={`faq-${i}`} className="max-w-[760px] px-1 pb-6 text-[15px] leading-[1.7] text-pretty text-muted">
                {f.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
