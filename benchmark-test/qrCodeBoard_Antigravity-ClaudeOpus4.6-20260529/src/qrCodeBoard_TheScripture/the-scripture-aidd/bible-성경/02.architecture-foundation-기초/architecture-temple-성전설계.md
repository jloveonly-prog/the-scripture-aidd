# 🏗️ 시스템 설계서 — QR Code 게시판 홈페이지

> *"And God made the firmament."* — Genesis 1:7 (KJV)

---

## 1. 시스템 개요

| 항목 | 내용 |
|:---|:---|
| 시스템명 | QR Code Board (QR 코드 게시판 홈페이지) |
| 버전 | v1.0 |
| 아키텍트 | Adam (개발 에이전트) |
| 상태 | **Canonized(정경화)** |

---

## 2. 기술 스택

| 계층 | 기술 | 선택 근거 |
|:---|:---|:---|
| Backend | Node.js + Hono | req.md 지정. 경량 웹 프레임워크 |
| Frontend | Hono JSX + HTMX + Alpine.js + Tailwind | req.md 지정. SSR + 부분 갱신 |
| Database | SQLite (better-sqlite3) | req.md 지정. 로컬 파일 DB, 별도 서버 불필요 |
| Infra | 로컬 PC | req.md 지정. 포트 4000 |

---

## 3. 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────┐
│  사용자 (QR 스캔 → 브라우저)                       │
└─────────────┬───────────────────────────────────┘
              │ HTTP Request (Port 4000)
              ▼
┌─────────────────────────────────────────────────┐
│  Hono Server (Node.js)                          │
│  ┌───────────────┐  ┌────────────────────────┐  │
│  │ routes/        │  │ views/                 │  │
│  │  home.tsx      │  │  layout.tsx            │  │
│  │  board.tsx     │  │  home.tsx              │  │
│  └───────┬───────┘  │  board/                │  │
│          │          │   list.tsx              │  │
│          ▼          │   detail.tsx            │  │
│  ┌───────────────┐  │   form.tsx             │  │
│  │ services/      │  └────────────────────────┘  │
│  │  boardService  │                              │
│  └───────┬───────┘                              │
│          │                                       │
│          ▼                                       │
│  ┌───────────────┐                              │
│  │ db/            │                              │
│  │  database.ts   │ ← SQLite (better-sqlite3)   │
│  │  schema.ts     │                              │
│  │  qrboard.db    │                              │
│  └───────────────┘                              │
└─────────────────────────────────────────────────┘
```

---

## 4. 폴더 구조 판단

### 판단 체크리스트

| # | 질문 | 답변 | 결과 |
|:--|:---|:---|:---|
| 1 | CRUD가 포함되어 있는가? | ✅ YES (게시판 작성/읽기/수정/삭제) | **CRUD 강제 분리 적용** |
| 2 | 화면 수는 몇 개인가? | 5개 (홈·목록·상세·작성폼·수정폼) | 4개 이상 → 분리 |
| 3 | 한 파일에 HTTP 처리 + 렌더링이 섞이는가? | YES (분리하지 않으면) | **분리 필수** |

### 판단 결과

- **채택 구조:** routes/ + views/ + services/ + db/ 4계층 분리
- **판단 근거:** CRUD(게시판) 포함 + 화면 5개 = 체크리스트 #1, #2 모두 분리 조건 충족
- **예상 최대 파일 줄 수:** 약 150줄 (300줄 이하, 단일 책임)
- **파일 목록:**

```
fruit-열매/
├── src/
│   ├── index.ts             ← 앱 진입점 (서버 구동)
│   ├── routes/              ← HTTP 핸들러 (요청 수신/응답 반환만)
│   │   ├── home.tsx         ← 홈페이지 라우트
│   │   └── board.tsx        ← 게시판 CRUD 라우트
│   ├── views/               ← 화면 템플릿 (UI 렌더링만)
│   │   ├── layout.tsx       ← 공통 레이아웃
│   │   ├── home.tsx         ← 홈페이지 화면
│   │   └── board/
│   │       ├── list.tsx     ← 게시판 목록 화면
│   │       ├── detail.tsx   ← 게시판 상세 화면
│   │       └── form.tsx     ← 게시판 작성/수정 폼
│   ├── services/            ← 비즈니스 로직
│   │   └── boardService.ts  ← 게시판 CRUD 로직
│   └── db/                  ← 데이터/DB
│       ├── database.ts      ← DB 연결 + 초기화
│       └── schema.ts        ← 테이블 DDL
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

---

## 5. 인프라/서버 구성

| 항목 | 설정 |
|:---|:---|
| 서버 구성 | 로컬 PC (단일 서버) |
| 서버 포트 | 4000 |
| DB | SQLite 파일 DB (qrboard.db) |
| 캐시 전략 | 불필요 (단일 사용자 로컬 환경) |
| 배포 환경 | 로컬 개발 환경 (npm run dev) |

---

## 6. 시퀀스 다이어그램 — 게시글 작성 흐름

```
사용자          routes/board    services/boardService    db/database
  │                │                    │                    │
  │  POST /board   │                    │                    │
  │ (title, content)│                   │                    │
  │───────────────>│                    │                    │
  │                │  createPost(data)  │                    │
  │                │───────────────────>│                    │
  │                │                    │  INSERT INTO posts │
  │                │                    │───────────────────>│
  │                │                    │  OK (lastInsertRowid)│
  │                │                    │<───────────────────│
  │                │   { id, ... }      │                    │
  │                │<───────────────────│                    │
  │  302 → /board  │                    │                    │
  │<───────────────│                    │                    │
```

---

## 7. 보안 아키텍처

| 항목 | 적용 |
|:---|:---|
| 인증 | 불필요 (req.md에 언급 없음, 공개 게시판) |
| XSS 방어 | Hono JSX 자동 이스케이프 |
| SQL Injection 방어 | better-sqlite3 파라미터 바인딩 |
| CSRF | HTMX 요청은 Same-Origin, 추가 방어 불필요 |
| 입력 검증 | 3중 방어 (클라이언트 required + 서버 trim/빈값 + DB CHECK) |

---

## 8. 아키텍처 결정 체인

| 결정 사항 | 근거 REQ-ID | 왜 이 선택인가 | 이 결정이 만드는 제약 | Phase 3/4 영향 |
|:--|:--|:--|:--|:--|
| Hono (백엔드) | C-001 | req.md 기술 스택 지정 | Hono JSX로 SSR 렌더링 | views/*.tsx로 JSX 컴포넌트 작성 |
| Hono JSX (프론트) | C-001 | req.md 기술 스택 지정 | JSX 문법으로 HTML 생성 | 컴포넌트 기반 UI 개발 |
| HTMX | C-001 | req.md 기술 스택 지정 | 부분 페이지 갱신 | hx-* 속성으로 AJAX 처리 |
| Alpine.js | C-001 | req.md 기술 스택 지정 | 클라이언트 인터랙션 | x-* 속성으로 UI 상태 관리 |
| Tailwind CSS | C-001 | req.md 기술 스택 지정 | 유틸리티 클래스 스타일링 | 별도 CSS 파일 최소화 |
| SQLite | C-001 | req.md 기술 스택 지정, 로컬 PC | 파일 기반 DB, 서버 불필요 | better-sqlite3로 동기 쿼리 |
| 포트 4000 | C-003 | autoRun 지침 | 다른 포트 사용 불가 | 서버 구동 시 4000 고정 |
| 인증 없음 | 범위 제외 | req.md에 인증 언급 없음 | 모든 사용자 CRUD 가능 | 권한 체크 로직 불필요 |
