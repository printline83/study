# 한의원 랜딩페이지 (hanbang)

원페이지 랜딩 + 상담 신청 + 관리자 페이지.

- **디자인 정본**: Claude Design 프로젝트 `46faf156-0fdb-43c2-8845-6415e71e4643` 의 `한의원 랜딩.dc.html`
- **요구사항**: `01_BRD_한의원_랜딩페이지.md`, `02_PRD_한의원_랜딩페이지.md` (PRD 의 PHP/CodeIgniter 스택 대신 Next.js 로 구현)
- 병원명·주소·전화·원장 약력은 **시안 임시값**이다. 확정되면 `src/content/clinic.ts` 한 파일만 고치면 된다.

## 기술 스택
- Next.js 16 (App Router, TypeScript, Tailwind v4), 글꼴 Pretendard
- Prisma 7 (`@prisma/adapter-pg`) — DB 구조·변경 이력
- Supabase — 로컬은 Supabase CLI 가 Docker 로 띄움 (Postgres·Auth·Studio)

## 처음 시작
```bash
npm install                # prisma generate 자동 실행
cp .env.example .env       # 키 값은 아래 status 출력으로 채움
npm run supabase:start     # Docker 로 Supabase 기동
npm run supabase:status    # ANON_KEY / SERVICE_ROLE_KEY / DB_URL 확인 → .env
npm run db:migrate         # DB 구조 적용
npm run admin:create -- <이메일> '<비밀번호>'   # 관리자 계정 (.env 의 ADMIN_EMAILS 에도 등록)
npm run dev                # http://localhost:3000
```

## 화면
| 주소 | 설명 |
|---|---|
| `/` | 랜딩 (Hero·증상·원장·진료·과정·둘러보기·오시는 길·FAQ·상담 신청·푸터) |
| `/admin/login` | 관리자 로그인 (Supabase Auth 이메일·비밀번호) |
| `/admin` | 상담 목록 · 상태 탭(신규/연락중/완료/부재중/보류) · 스팸 탭 · 상태·메모 저장 |

로컬 관리자 계정은 위 명령으로 각자 만든다. 비밀번호는 저장소에 적지 않는다.

## 상담 신청 규칙 (PRD F-01)
| 항목 | 내용 |
|---|---|
| 필수 | 성함(2~20자 한글·영문), 연락처(숫자 10~11자리, 입력 중 자동 하이픈), 상담 분야, 개인정보 동의 |
| 오류 표시 | 칸 아래 문구 + 첫 오류 칸으로 이동. 화면과 서버가 같은 검사 함수(`src/lib/consultation.ts`) 사용 |
| SEC-01 | 숨은 `website` 칸에 값이 있으면 성공 응답만 주고 저장 안 함 |
| SEC-02 | 폼이 뜬 뒤 3초 안에 제출되면 저장 안 함 |
| SEC-03 | 같은 IP 10분 내 3건 초과 시 차단 |
| SEC-04 | 다른 사이트에서 보낸 요청 거부 |
| SEC-05 | 주소(URL)·광고성 단어가 있으면 저장하되 스팸 표시 → 관리자 스팸 탭 |
| FR-01-6 | 유입 경로·UTM·IP·브라우저 정보 함께 저장 |

## 화면 폭별 동작
- PC(768px 이상): 상단 메뉴 + 오른쪽 아래 떠 있는 `상담 신청` 버튼
- 모바일: 상단 메뉴 숨김 + 하단 고정바 `전화 걸기 | 오시는 길 | 상담 신청` (PRD §2)
- 시안의 대표 사진 영역은 휴대폰에서 폭 600px 로 고정되는 문제가 있어, 640px 미만에서는 비율 고정을 푼다.

## 확인 주소 (로컬)
| 용도 | 주소 |
|---|---|
| 앱 | http://localhost:3000 |
| DB 연결 점검 | http://localhost:3000/api/health |
| Supabase Studio | http://127.0.0.1:54323 |
| Postgres | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |

## 폴더
```
src/content/clinic.ts       랜딩 문구·병원 정보 (교체는 여기서)
src/lib/consultation.ts     상담 분야·희망 시간·검사 규칙·스팸 판정 (화면·서버 공용)
src/components/landing/     상담폼 · FAQ · 둘러보기 · 주소 복사 · 개인정보 창
src/app/page.tsx            랜딩 본문
src/app/api/consultations/  상담 신청 저장 (POST)
src/app/admin/              관리자 로그인·목록
prisma/                     schema.prisma, migrations/
```

## PRD 대비 남은 일
- 관리자: 신규 건수 배너·탭 제목 건수·60초 자동 갱신, 상세 화면, 소프트 삭제, 엑셀 다운로드, 처리 이력 기록
- 관리자 로그인: 아이디 방식·5회 실패 잠금·2시간 자동 로그아웃 (지금은 Supabase 이메일 로그인)
- `/privacy`·`/price` 별도 페이지, 보유기간 경과 자동 파기
- 네이버 지도, GA4·네이버 전환 집계, 구조화 데이터·sitemap
- 실제 사진·원고 교체, 의료광고 심의 문구 검수
