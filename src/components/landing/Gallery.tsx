"use client";

import { useRef } from "react";

/** 병원 둘러보기 — 가로로 넘기는 사진 줄 */
export function Gallery({ items, headingClassName }: { items: readonly string[]; headingClassName: string }) {
  const track = useRef<HTMLDivElement>(null);
  const move = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.5, behavior: "smooth" });
  };
  const arrow =
    "size-[42px] cursor-pointer rounded-full border border-line-strong bg-white text-[16px] hover:border-ink";

  return (
    <section className="pt-24">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <h2 className={headingClassName}>병원 둘러보기</h2>
        <div className="flex gap-2">
          <button type="button" aria-label="이전 사진" onClick={() => move(-1)} className={arrow}>
            ←
          </button>
          <button type="button" aria-label="다음 사진" onClick={() => move(1)} className={arrow}>
            →
          </button>
        </div>
      </div>
      <div ref={track} className="no-scrollbar mt-6 snap-x snap-mandatory overflow-x-auto rounded-[20px]">
        <div className="flex gap-3">
          {items.map((g) => (
            <div
              key={g}
              className="stripe-stone flex aspect-[4/3] flex-[0_0_clamp(260px,46%,520px)] snap-start items-end rounded-[20px] p-[18px]"
            >
              <span className="font-mono text-[12px] text-[#71706a]">{g}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
