# 🧱 태스크 분해 계획 (성벽) — QR코드 게시판

> **bible-성경/04.development-repentance-회개/task-wall-성벽.md**
> *"옳게 분변하라" — 2 Timothy 2:15*

---

## 의존성 맵

```
TASK-001 (환경설정)
    └── TASK-002 (DB)
          └── TASK-003 (라우트-홈)
          └── TASK-004 (라우트-게시판)
                └── TASK-005 (뷰-레이아웃)
                      ├── TASK-006 (뷰-홈)
                      ├── TASK-007 (뷰-게시판목록)
                      ├── TASK-008 (뷰-게시판작성)
                      └── TASK-009 (뷰-게시판상세)
```

---

## 태스크 목록

| TASK-ID | 설명 | 연결 REQ | 생성 파일 | 파일의 단일 책임 | 예상 줄 수 |
|:---|:---|:---|:---|:---|:---:|
| TASK-001 | 프로젝트 초기화 + 설정 | NFR-004, C-003 | `package.json` | 의존성 + 스크립트 선언 | ~50 |
| TASK-001 | 타입스크립트 설정 | NFR-004 | `tsconfig.json` | TS 컴파일 옵션 | ~20 |
| TASK-001 | 서버 진입점 | REQ-003, C-003 | `src/index.ts` | Hono 앱 초기화 + 포트 4000 구동 + export | ~50 |
| TASK-002 | DB 초기화 + 쿼리 함수 | REQ-004,REQ-005,REQ-006 | `src/db/index.ts` | better-sqlite3 연결 + posts CRUD 쿼리 | ~80 |
| TASK-002 | DB 스키마 DDL | REQ-004,REQ-005,REQ-006 | `src/db/schema.ts` | CREATE TABLE DDL 문자열만 | ~20 |
| TASK-003 | 홈 라우트 | REQ-003 | `src/routes/home.ts` | GET / → 홈 뷰 반환 **만** | ~30 |
| TASK-004 | 게시판 라우트 | REQ-004,REQ-005,REQ-006 | `src/routes/board.ts` | GET/POST /board, GET /board/new, GET /board/:id **만** | ~100 |
| TASK-005 | 공통 레이아웃 | REQ-003 | `src/views/layout.tsx` | HTML 껍데기 + 네비게이션 렌더링 **만** | ~60 |
| TASK-006 | 홈 화면 뷰 | REQ-001,REQ-002,REQ-003 | `src/views/home/index.tsx` | QR 스캐너 UI + Alpine.js 렌더링 **만** | ~120 |
| TASK-007 | 게시판 목록 뷰 | REQ-004 | `src/views/board/list.tsx` | 게시글 목록 렌더링 **만** | ~70 |
| TASK-008 | 게시글 작성 폼 뷰 | REQ-005 | `src/views/board/form.tsx` | 작성 폼 렌더링 **만** | ~70 |
| TASK-009 | 게시글 상세 뷰 | REQ-006 | `src/views/board/detail.tsx` | 게시글 상세 렌더링 **만** | ~60 |

> ✅ 모든 파일 예상 줄 수 300줄 미만 — 500줄 초과 없음

---

## 파일 분리 검증

| 파일 | HTTP 처리 | 렌더링 | 책임 혼재 여부 |
|:---|:---:|:---:|:---|
| `src/index.ts` | ✅ | ❌ | ❌ 단일 책임 (서버 진입점) |
| `src/db/index.ts` | ❌ | ❌ | ❌ 단일 책임 (DB 레이어) |
| `src/routes/home.ts` | ✅ | ❌ | ❌ 단일 책임 (HTTP 처리만) |
| `src/routes/board.ts` | ✅ | ❌ | ❌ 단일 책임 (HTTP 처리만) |
| `src/views/layout.tsx` | ❌ | ✅ | ❌ 단일 책임 (렌더링만) |
| `src/views/home/index.tsx` | ❌ | ✅ | ❌ 단일 책임 (렌더링만) |
| `src/views/board/list.tsx` | ❌ | ✅ | ❌ 단일 책임 (렌더링만) |
| `src/views/board/form.tsx` | ❌ | ✅ | ❌ 단일 책임 (렌더링만) |
| `src/views/board/detail.tsx` | ❌ | ✅ | ❌ 단일 책임 (렌더링만) |

> ✅ 모든 파일 책임 분리 완료

---

## 진행 상태

| TASK-ID | 상태 | 완료 시각 |
|:---|:---:|:---|
| TASK-001 | ⬜ | — |
| TASK-002 | ⬜ | — |
| TASK-003 | ⬜ | — |
| TASK-004 | ⬜ | — |
| TASK-005 | ⬜ | — |
| TASK-006 | ⬜ | — |
| TASK-007 | ⬜ | — |
| TASK-008 | ⬜ | — |
| TASK-009 | ⬜ | — |
