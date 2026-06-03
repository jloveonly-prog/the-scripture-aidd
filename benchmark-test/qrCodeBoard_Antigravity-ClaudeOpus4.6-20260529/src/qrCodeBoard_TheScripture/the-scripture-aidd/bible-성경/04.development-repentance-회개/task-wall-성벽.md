# 🧱 태스크 분해 계획 — QR Code 게시판 홈페이지

> *"Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth."* — 2 Timothy 2:15 (KJV)

---

## 0단계: 이상 징후 스캔

- Phase 2 아키텍처 중 특이점: 없음. 단일 테이블(posts), 단순 CRUD.
- Phase 1 REQ 중 특이점: 없음. 표준 게시판 CRUD.
- 결론: 이상 징후 없음. 표준 패턴 적용.

---

## Task 분해

| TASK-ID | 설명 | 연결 REQ | 생성 파일 | 파일의 단일 책임 | 예상 줄 수 | 의존성 |
|:---|:---|:---|:---|:---|:---:|:---|
| TASK-001 | 프로젝트 초기화 | C-001 | `package.json`, `tsconfig.json` | 프로젝트 설정 | 30줄 | — |
| TASK-002 | DB 스키마 + 연결 | REQ-002, TBL-001 | `src/db/database.ts` | DB 연결 + 초기화 + CRUD 쿼리 | 80줄 | TASK-001 |
| TASK-003 | 공통 레이아웃 | FR-001 | `src/views/layout.tsx` | 공통 HTML 레이아웃 (head, nav, footer) | 60줄 | TASK-001 |
| TASK-004 | 홈페이지 라우트 | REQ-001, FR-001, API-001 | `src/routes/home.tsx` | 홈페이지 HTTP 핸들러 | 20줄 | TASK-003 |
| TASK-005 | 홈페이지 화면 | REQ-001, FR-001, SCR-001 | `src/views/home.tsx` | 홈페이지 UI 렌더링 | 40줄 | TASK-003 |
| TASK-006 | 게시판 서비스 | REQ-002, FR-002~006 | `src/services/boardService.ts` | 게시판 CRUD 비즈니스 로직 | 60줄 | TASK-002 |
| TASK-007 | 게시판 라우트 | REQ-002, API-002~008 | `src/routes/board.tsx` | 게시판 HTTP 핸들러 | 100줄 | TASK-006 |
| TASK-008 | 게시판 목록 화면 | FR-002, SCR-002 | `src/views/board/list.tsx` | 게시판 목록 렌더링만 | 50줄 | TASK-003 |
| TASK-009 | 게시판 상세 화면 | FR-003, SCR-003 | `src/views/board/detail.tsx` | 게시글 상세 렌더링만 | 50줄 | TASK-003 |
| TASK-010 | 게시판 폼 화면 | FR-004, FR-005, SCR-004, SCR-005 | `src/views/board/form.tsx` | 작성/수정 공용 폼 렌더링만 | 50줄 | TASK-003 |
| TASK-011 | 앱 진입점 | C-003 | `src/index.ts` | 서버 구동 + 라우트 등록 | 30줄 | TASK-004, TASK-007 |
| TASK-012 | Tailwind 설정 | C-001 | `tailwind.config.js`, `src/styles/globals.css` | CSS 빌드 설정 | 20줄 | TASK-001 |

---

## 파일 분리 검증

| 파일 | HTTP 처리 | 렌더링 | DB 접근 | 비즈니스 로직 | 분리 필요? |
|:---|:---:|:---:|:---:|:---:|:---:|
| `src/routes/board.tsx` | ✅ | ❌ | ❌ | ❌ | ✅ 단일 책임 |
| `src/views/board/list.tsx` | ❌ | ✅ | ❌ | ❌ | ✅ 단일 책임 |
| `src/services/boardService.ts` | ❌ | ❌ | ❌ | ✅ | ✅ 단일 책임 |
| `src/db/database.ts` | ❌ | ❌ | ✅ | ❌ | ✅ 단일 책임 |

> ✅ 모든 파일이 단일 책임. 분리 불필요. 예상 최대 줄 수: 100줄 (300줄 이하).

---

## 의존성 맵

```
TASK-001 (프로젝트 초기화)
    ├── TASK-002 (DB)
    │     └── TASK-006 (서비스)
    │           └── TASK-007 (라우트)
    ├── TASK-003 (레이아웃)
    │     ├── TASK-004 (홈 라우트)
    │     ├── TASK-005 (홈 화면)
    │     ├── TASK-008 (목록 화면)
    │     ├── TASK-009 (상세 화면)
    │     └── TASK-010 (폼 화면)
    ├── TASK-011 (앱 진입점) ← TASK-004, TASK-007 완료 후
    └── TASK-012 (Tailwind)
```
