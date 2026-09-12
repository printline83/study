import {
  CAREER,
  CLINIC,
  FACTS,
  FAQS,
  GALLERY,
  HOURS,
  NAV,
  STEPS,
  SYMPTOMS,
  TREATMENTS,
} from "@/content/clinic";
import { ConsultForm } from "@/components/landing/ConsultForm";
import { CopyAddressButton } from "@/components/landing/CopyAddressButton";
import { FaqList } from "@/components/landing/FaqList";
import { Gallery } from "@/components/landing/Gallery";
import { PrivacyButton, PrivacyProvider } from "@/components/landing/Privacy";

// 디자인 정본: Claude Design「한의원 랜딩.dc.html」
const tel = `tel:${CLINIC.tel}`;
const h2Large = "text-[length:clamp(28px,4.2vw,46px)] leading-[1.15] font-bold tracking-[-0.035em] text-balance";
const h2Small = "text-[length:clamp(26px,3.6vw,40px)] font-bold tracking-[-0.035em]";
const chip = "inline-flex items-center gap-2 rounded-lg bg-chip px-[13px] py-1.5 text-[12px] tracking-[0.08em] text-muted";
const eyebrow = "text-[12px] tracking-[0.08em] text-[#8a8a82]";
const btnDark = "inline-flex items-center rounded-full bg-ink font-semibold text-white hover:bg-brand";
const btnLine = "inline-flex items-center rounded-full border border-line-strong font-semibold text-ink hover:border-ink";
const photoNote = "px-5 text-center font-mono text-[12.5px] tracking-[0.06em]";
const tableBox = "grid gap-px overflow-hidden rounded-[14px] border border-line bg-line";

export default function Home() {
  return (
    <div className="flex-1 leading-[normal]">
      <PrivacyProvider>
        <div className="mx-auto w-full max-w-[1160px] px-5">
          <header className="sticky top-0 z-40 flex items-center justify-between gap-4 bg-white/88 py-3.5 backdrop-blur-[12px]">
            <a href="#top" className="flex items-center gap-[9px] text-[19px] font-bold tracking-[-0.02em]">
              <span className="inline-block size-[22px] rounded-full bg-brand" />
              {CLINIC.name}
            </a>
            <nav className="hidden gap-[26px] text-[14.5px] md:flex">
              {NAV.map((n) => (
                <a key={n.href} href={n.href}>
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <a href={tel} className="hidden text-[14.5px] text-muted sm:inline">
                {CLINIC.phone}
              </a>
              <a href="#consult" className={`${btnDark} h-[42px] px-5 text-[14.5px]`}>
                상담 신청
              </a>
            </div>
          </header>

          <main>
            {/* S1 Hero */}
            <section id="top" className="pt-14 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e7e6e2] py-[7px] pr-[15px] pl-[11px] text-[13.5px] text-muted">
                <span className="size-[7px] rounded-full bg-brand" />
                진료시간 내 순차적으로 연락드립니다
              </div>
              <h1 className="mt-[26px] text-[length:clamp(40px,7.2vw,78px)] leading-[1.04] font-bold tracking-[-0.045em] text-balance">
                통증은 참는 것이
                <br />
                아니라 치료하는 것
              </h1>
              <p className="mx-auto mt-[22px] max-w-[560px] text-[length:clamp(15px,1.7vw,18px)] leading-[1.6] text-pretty text-muted">
                허리·목 통증, 교통사고 후유증, 만성피로.
                <br />
                한의사 1:1 진료로 원인부터 확인합니다.
              </p>
              <div className="mt-[30px] flex flex-wrap justify-center gap-2.5">
                <a href="#consult" className={`${btnDark} h-[52px] px-7 text-[15.5px]`}>
                  상담 신청하기
                </a>
                <a href={tel} className={`${btnLine} h-[52px] px-7 text-[15.5px]`}>
                  전화 문의
                </a>
              </div>
            </section>

            <section className="stripe-sage relative mt-11 flex min-h-[300px] sm:aspect-[16/8] items-center justify-center overflow-hidden rounded-[22px]">
              <div className="absolute top-[18px] left-[18px] flex items-center gap-[9px] rounded-full bg-white/92 py-[7px] pr-[14px] pl-2 text-[13.5px] font-semibold">
                <span className="size-[22px] rounded-full bg-brand" />
                진료실
              </div>
              <div className={`${photoNote} text-[#5d6b5c]`}>[ 대표 이미지 — 진료실 / 원장 진료 장면 가로 사진 ]</div>
              <div className="absolute bottom-[22px] left-1/2 w-[min(440px,calc(100%_-_36px))] -translate-x-1/2 rounded-2xl bg-white px-3.5 pt-3.5 pb-3 text-left shadow-[0_18px_40px_rgba(16,16,16,0.14)]">
                <div className="text-[14.5px] font-semibold">어떤 증상으로 오셨나요?</div>
                <div className="mt-2.5 flex items-center justify-between gap-3 border-t border-[#f0efeb] pt-2.5">
                  <span className="text-[13.5px] text-[#7a7a73]">성함과 연락처만 남겨주세요</span>
                  <a
                    href="#consult"
                    aria-label="상담 신청으로 이동"
                    className="inline-flex size-[34px] items-center justify-center rounded-full bg-ink text-[15px] text-white hover:bg-brand"
                  >
                    ↓
                  </a>
                </div>
              </div>
            </section>

            <section className="mt-3.5 grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-3">
              {FACTS.map((f) => (
                <div key={f.label} className="rounded-2xl border border-line bg-surface px-5 pt-5 pb-[18px]">
                  <div className="text-[12px] tracking-[0.08em] text-[#8a8a82] uppercase">{f.label}</div>
                  <div className="mt-2.5 text-[26px] font-bold tracking-[-0.03em]">{f.value}</div>
                  <div className="mt-1.5 text-[13.5px] text-sub">{f.note}</div>
                </div>
              ))}
            </section>

            {/* S2 이런 증상이라면 */}
            <section id="symptoms" className="pt-24">
              <div className={chip}>이런 증상이라면</div>
              <h2 className={`mt-5 max-w-[720px] ${h2Large}`}>
                오래 두면 습관이 되는 증상들, <span className="text-[#a8a79f]">지금 확인해 보세요</span>
              </h2>
              <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-3">
                {SYMPTOMS.map((s) => (
                  <div key={s.title} className="rounded-[18px] border border-line bg-white p-6 hover:border-ink">
                    <div className="size-[30px] rounded-[9px] bg-sage" />
                    <div className="mt-[18px] text-[18.5px] font-bold tracking-[-0.02em]">{s.title}</div>
                    <div className="mt-[9px] text-[14.5px] leading-[1.55] text-pretty text-sub">{s.body}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* S3 원장 소개 */}
            <section id="doctor" className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] items-center gap-9 pt-24">
              <div className="stripe-warm flex aspect-[4/5] min-h-[320px] items-center justify-center overflow-hidden rounded-[20px]">
                <div className={`${photoNote} text-[#7a6f68]`}>[ 원장 프로필 사진 세로 ]</div>
              </div>
              <div>
                <div className={eyebrow}>원장 소개</div>
                <h2 className="mt-4 text-[length:clamp(28px,4vw,44px)] leading-[1.12] font-bold tracking-[-0.035em]">
                  {CLINIC.owner} 원장
                  <span className="text-[0.42em] font-medium tracking-[-0.01em] text-[#8a8a82]"> 한의학박사</span>
                </h2>
                <p className="mt-[18px] max-w-[460px] text-[16px] leading-[1.65] text-pretty text-muted">
                  근골격계 통증과 교통사고 후유증 진료를 중심으로 진료해 왔습니다. 증상만 덮는 처치보다, 생활 습관과
                  체질까지 함께 살피는 진료를 지향합니다.
                </p>
                <div className={`mt-[26px] ${tableBox}`}>
                  {CAREER.map((c) => (
                    <div key={c.k} className="flex gap-4 bg-white px-[18px] py-3.5 text-[14.5px]">
                      <span className="min-w-[62px] text-[#9a9a92]">{c.k}</span>
                      <span className="text-[#33332f]">{c.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* S4 진료 안내 */}
            <section id="care" className="pt-24">
              <div className={chip}>진료 안내</div>
              <h2 className={`mt-5 max-w-[700px] ${h2Large}`}>
                증상에 따라 치료 방법을 <span className="text-[#a8a79f]">조합합니다</span>
              </h2>
              <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] gap-3">
                {TREATMENTS.map((t) => (
                  <div key={t.tag} className="rounded-[18px] border border-[#f0efeb] bg-surface px-6 py-[26px]">
                    <div className="text-[12px] tracking-[0.08em] text-brand">{t.tag}</div>
                    <div className="mt-3.5 text-[20px] font-bold tracking-[-0.025em]">{t.title}</div>
                    <div className="mt-2.5 text-[14.5px] leading-[1.6] text-pretty text-sub">{t.body}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* S5 치료 과정 */}
            <section className="pt-24">
              <h2 className={h2Small}>처음 오셔도 어렵지 않게</h2>
              <div className="mt-[30px] grid grid-cols-[repeat(auto-fit,minmax(min(210px,100%),1fr))] gap-3">
                {STEPS.map((st) => (
                  <div key={st.no} className="border-t-2 border-ink pt-4">
                    <div className="text-[13px] font-bold text-brand">{st.no}</div>
                    <div className="mt-2.5 text-[18.5px] font-bold tracking-[-0.02em]">{st.title}</div>
                    <div className="mt-2 text-[14.5px] leading-[1.55] text-pretty text-sub">{st.body}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* S6 병원 둘러보기 */}
            <Gallery items={GALLERY} headingClassName={h2Small} />

            {/* S7 진료시간 / 오시는 길 */}
            <section id="visit" className="grid grid-cols-[repeat(auto-fit,minmax(min(290px,100%),1fr))] gap-7 pt-24">
              <div>
                <div className={eyebrow}>진료시간</div>
                <h2 className={`mt-4 ${h2Small}`}>오시는 길</h2>
                <div className={`mt-6 ${tableBox}`}>
                  {HOURS.map((h) => (
                    <div key={h.day} className="flex justify-between gap-4 bg-white px-[18px] py-[13px] text-[14.5px]">
                      <span className="text-muted">{h.day}</span>
                      <span className="font-semibold tracking-[-0.01em]">{h.time}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 text-[14.5px] leading-[1.7] text-muted">
                  {CLINIC.address}
                  <br />
                  {CLINIC.directions}
                </div>
                <div className="mt-[18px] flex flex-wrap gap-2">
                  <CopyAddressButton address={CLINIC.address} />
                  <a href={tel} className={`${btnDark} h-[46px] px-5 text-[14.5px]`}>
                    전화 연결
                  </a>
                </div>
              </div>
              <div className="stripe-sage flex min-h-[340px] items-center justify-center rounded-[20px]">
                <div className="px-5 text-center font-mono text-[12.5px] text-[#5d6b5c]">[ 네이버 지도 API 마커 영역 ]</div>
              </div>
            </section>

            {/* S8 자주 묻는 질문 */}
            <section id="faq" className="pt-24">
              <h2 className={h2Small}>자주 묻는 질문</h2>
              <FaqList items={FAQS} />
            </section>

            {/* S9 상담 신청 */}
            <section id="consult" className="pt-24">
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(290px,100%),1fr))] gap-[clamp(28px,5vw,56px)] rounded-[26px] bg-ink p-[clamp(28px,5vw,56px)] text-white">
                <div>
                  <div className="text-[12px] tracking-[0.08em] text-[#9a9a92]">상담 신청</div>
                  <h2 className="mt-4 text-[length:clamp(28px,4vw,46px)] leading-[1.12] font-bold tracking-[-0.035em] text-white">
                    성함과 연락처만
                    <br />
                    남겨주세요
                  </h2>
                  <p className="mt-[18px] max-w-[380px] text-[15.5px] leading-[1.65] text-pretty text-[#b8b8b2]">
                    진료시간 내 순차적으로 연락드려 증상과 내원 가능한 시간을 안내해 드립니다.
                  </p>
                  <div className="mt-7 text-[14.5px] text-[#b8b8b2]">
                    전화 상담{" "}
                    <a href={tel} className="font-semibold text-white">
                      {CLINIC.phone}
                    </a>
                  </div>
                </div>
                <ConsultForm />
              </div>
            </section>
          </main>

          {/* S10 푸터 */}
          <footer className="mt-[72px] border-t border-line pt-[72px] pb-[120px]">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-7">
              <div>
                <div className="flex items-center gap-[9px] text-[18px] font-bold tracking-[-0.02em]">
                  <span className="size-5 rounded-full bg-brand" />
                  {CLINIC.name}
                </div>
                <div className="mt-3.5 text-[13.5px] leading-[1.75] text-[#7a7a73]">
                  대표자 {CLINIC.owner} · 사업자등록번호 {CLINIC.bizNo}
                  <br />
                  {CLINIC.address} · {CLINIC.phone}
                </div>
              </div>
              <div className="text-[13.5px] leading-[1.9] text-[#7a7a73]">
                <div>
                  <a href="#consult">상담 신청</a>
                </div>
                <div>
                  <a href="#visit">오시는 길</a>
                </div>
                <div>
                  <PrivacyButton className="cursor-pointer bg-transparent p-0 text-[13.5px] leading-[normal] text-[#7a7a73]">
                    개인정보처리방침
                  </PrivacyButton>
                </div>
                <div>
                  <a href="#care">비급여 진료비용 안내</a>
                </div>
              </div>
              <div className="text-[12.5px] leading-[1.8] text-pretty text-[#9a9a92]">
                본 페이지의 진료 관련 내용은 일반적인 정보 제공을 목적으로 하며, 개인의 증상과 체질에 따라 치료 방법과
                경과는 다를 수 있습니다.
              </div>
            </div>
          </footer>
        </div>

        {/* 고정 버튼 — PRD §2: 모바일은 하단 고정바, PC 는 우측 하단 상담 버튼 */}
        <div className="fixed inset-x-0 bottom-0 z-50 flex gap-2 border-t border-line bg-white/94 px-3 pt-2.5 pb-[calc(10px_+_env(safe-area-inset-bottom))] backdrop-blur-[12px] md:hidden">
          <a href={tel} className="flex h-[50px] flex-1 items-center justify-center rounded-full border border-line-strong text-[15px] font-semibold">
            전화 걸기
          </a>
          <a href="#visit" className="flex h-[50px] flex-1 items-center justify-center rounded-full border border-line-strong text-[15px] font-semibold">
            오시는 길
          </a>
          <a href="#consult" className="flex h-[50px] flex-[1.3] items-center justify-center rounded-full bg-ink text-[15px] font-bold text-white">
            상담 신청
          </a>
        </div>
        <a
          href="#consult"
          className="fixed right-6 bottom-6 z-50 hidden h-[52px] items-center rounded-full bg-ink px-7 text-[15.5px] font-semibold text-white shadow-[0_18px_40px_rgba(16,16,16,0.18)] hover:bg-brand md:inline-flex"
        >
          상담 신청
        </a>
      </PrivacyProvider>
    </div>
  );
}
