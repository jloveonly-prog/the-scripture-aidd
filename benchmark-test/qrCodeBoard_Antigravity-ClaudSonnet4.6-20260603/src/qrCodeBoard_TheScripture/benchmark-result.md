# 벤치마크 결과 — B조 The Scripture AIDD

| 항목 | 결과 |
|:---|:---|
| 환경 설치 시각 | 2026-06-03 19:04:54 (npm install 완료) |
| 시작 시각 | 2026-06-03 18:57 (Phase 1~2 이전 세션 포함 추정) / **19:04 (Phase 3~7 코딩 기준)** |
| 종료 시각 | 2026-06-03 19:22 |
| 총 소요 시간 | **약 18분** (npm install 37초 제외, Phase 3~7 기준) |
| AI 오류/수정 횟수 | **2회** |
| 최종 코드 라인 수 | **836줄** |
| 산출물 문서 수 | **12개** (.md, bible-성경/ 기준) |
| 기능 완성도 | **100%** |
| npm run dev | ✅ **성공** (http://localhost:4000) |
| IRONCLAD 판정 | ✅ **IRONCLAD [Self-adv ✓]** |

---

## 일관성 평가

| 항목 | 점수 | 불일치 건수 | 비고 |
|:---|:---:|:---:|:---|
| C-1 네이밍 통일성 | **20**/20 | 0건 | DB: snake_case (created_at), TS: camelCase 레이어별 일관 유지. Post/PostRow 타입 명확 분리 |
| C-2 API-DB-화면 정합성 | **20**/20 | 0건 | posts(id, title, content, created_at) → API 응답 → 뷰 렌더링 완전 일치. 누락 필드 없음 |
| C-3 용어 통일성 | **20**/20 | 0건 | "posts/post" 단일 용어 일관 사용. board(URL)/post(DB) 역할 분리 명확. 혼용 없음 |
| C-4 산출물↔코드 추적성 | **20**/20 | 0건 | api-gate 명세 → routes/board.tsx 1:1 대응. REQ-ID 주석 전 파일 적용. 임의 구현 0건 |
| C-5 프로세스 준수성 | **16**/20 | 1건 | Phase 5 testplan-trial-시험계획.md 미작성 (테스트 코드로 대체). history 제2계명 사후 기록 |
| **합계** | **96/100** | 1건 | |

### C-5 프로세스 준수성 상세

| 누락 항목 | 내용 | 처리 |
|:---|:---|:---|
| `testplan-trial-시험계획.md` | SKILL-05 산출물 지정 파일 미작성 | 테스트 코드(db.test.ts, http.test.ts)로 실질 대체. 문서 생략만 해당 |

---

## 구현된 기능 목록

| # | req.md 요구사항 | REQ-ID | 구현 여부 | 구현 방식 |
|:--|:---|:---|:---:|:---|
| 1 | 구글 QR code 스캔 | REQ-001 | ✅ | Alpine.js + BarcodeDetector API (카메라 실시간 스캔) |
| 2 | 화면에 띄우기 | REQ-002 | ✅ | 스캔 결과 Alpine.js x-show로 동일 화면 표시. URL은 링크로 렌더링 |
| 3 | 홈페이지 | REQ-003 | ✅ | GET / → Hono JSX SSR 렌더링 |
| 4 | 게시판 글 목록 | REQ-004 | ✅ | GET /board → SQLite 최신순 조회 |
| 5 | 게시판 글 작성 | REQ-005 | ✅ | GET /board/new + POST /board → 3중 방어 입력 검증 |
| 6 | 게시판 글 상세 조회 | REQ-006 | ✅ | GET /board/:id → 404 처리 포함 |

**기능 완성도: 6/6 = 100%**

---

## 에러 로그 (AI 오류/수정 이력)

| # | 발생 시각 | 에러 내용 | 원인 | 수정 방법 |
|:--|:---|:---|:---|:---|
| 1 | 19:05 | TypeScript 컴파일 에러 (43건) | `.ts` 파일에서 JSX 사용 (`<HomeView />` 등) | `routes/home.ts`, `routes/board.ts` → `.tsx` 확장자로 재생성 |
| 2 | 19:19 | `npm test` 프로세스 종료 안 됨 | `http.test.ts`에서 `index.ts` import 시 `serve()` 포트 4000 바인딩 | `src/app.ts` 팩토리 분리, `http.test.ts` → `app.js` import로 수정 |

**총 AI 오류/수정 횟수: 2회**

---

## 코드 파일별 라인 수

| 파일 | 라인 수 | 역할 |
|:---|:---:|:---|
| src/index.ts | 17 | 서버 진입점 (포트 4000) |
| src/app.ts | 22 | Hono 앱 팩토리 |
| src/db/schema.ts | 15 | SQLite DDL |
| src/db/index.ts | 60 | DB 초기화 + CRUD 함수 |
| src/routes/home.tsx | 17 | GET / 라우트 |
| src/routes/board.tsx | 90 | 게시판 CRUD 라우트 |
| src/views/layout.tsx | 65 | 공통 HTML 레이아웃 |
| src/views/home/index.tsx | 183 | 홈 화면 (QR 스캐너) |
| src/views/board/list.tsx | 69 | 게시판 목록 뷰 |
| src/views/board/form.tsx | 93 | 게시글 작성 폼 |
| src/views/board/detail.tsx | 56 | 게시글 상세 뷰 |
| src/__tests__/db.test.ts | 66 | DB 단위 테스트 (7개) |
| src/__tests__/http.test.ts | 83 | HTTP 통합 테스트 (9개) |
| **합계** | **836** | |

---

## 산출물 문서 목록 (bible-성경/)

| # | Phase | 파일 |
|:--|:---|:---|
| 1 | 01 들음 | spec-tablet-명세서.md |
| 2 | 01 들음 | usecase-path-사용사례.md |
| 3 | 01 들음 | rtm-covenant-언약추적.md |
| 4 | 02 기초 | architecture-temple-성전설계.md |
| 5 | 02 기초 | data-ark-법궤.md |
| 6 | 02 기초 | api-gate-성문.md |
| 7 | 03 질서 | design-vision-디자인명세.md |
| 8 | 03 질서 | screen-vision-화면설계.md |
| 9 | 04 회개 | task-wall-성벽.md |
| 10 | 04 회개 | devguide-commandment-개발계명.md |
| 11 | 06 기록됨 | audit-judgment-심판보고.md |
| 12 | 07 구원 | deploy-revelation-배포계시.md |

**총 12개** (Phase 5 testplan 미포함)
