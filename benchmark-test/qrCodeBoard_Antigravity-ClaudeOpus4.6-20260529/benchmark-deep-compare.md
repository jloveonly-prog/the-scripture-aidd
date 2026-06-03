# ⚖️ qrCodeBoard 벤치마크 딥 비교 보고서

> **대상:** Addy (A조 Agent-Skills) vs TheScripture AIDD (B조 The Scripture)  
> **환경:** Antigravity IDE (단일 세션 자동 실행)  
> **모델:** A조 — Claude Opus 4.6 / B조 — Claude Opus 4.6  
> **기준:** 최신 소스 코드 산출물 전수 검증  
> **작성일:** 2026-05-29  
> **분석 모델:** Claude Opus 4.6 (Thinking)  
> **목적:** 두 AI 에이전트 방법론의 실제 산출물을 전수 검증하여 비교 분석

---

## 0. 평가 개요 및 요구사항

```markdown
# req.md (양측 동일)
레이어	기술
백엔드	Node.js (Hono)
프론트	Hono JSX + HTMX + Alpine.js + Tailwind
DB	SQLite
파일 저장	로컬 PC
인프라	로컬 PC

구글 QR code 스캔해서 화면에 띄우는 홈페이지 및 게시판 1개
```
**총 글자 수:** 약 120자 (기술 스택 테이블 + 기능 요구 1문장)

> [!NOTE]
> 핵심 요구사항은 **단 1문장**: "구글 QR code 스캔해서 화면에 띄우는 홈페이지 및 게시판 1개"
> 이 문장의 동사-명사 매핑이 곧 의미론적 충실도의 기준이 된다.

---

## 1. 핵심 실행 지표 (Core Metrics)

| 항목 | Addy (A조) | TheScripture (B조) | 우위 |
|:---|:---:|:---:|:---:|
| **시작 시각** | `2026-05-29T21:50:00+09:00` | `2026-05-29T21:49:00+09:00` | - |
| **종료 시각** | `2026-05-29T21:56:39+09:00` | `2026-05-29T22:00:00+09:00` 이후 | - |
| **총 소요 시간** | ~7분 | **11분 이상** | A조 (약 2배 빠름) |
| **AI 오류/수정 횟수** | 1회 | 3회 | A조 |
| **최종 코드 라인** | **1,049줄** (JS) | **745줄** (TS) | A조 (304줄 더 많음) |
| **산출물 문서 수** | **4개** | **13개** | B조 (9개 더 많음) |
| **테스트 케이스 수** | **25개** (DB 12 + Route 13) | **22개** (DB 10 + HTTP 12) | A조 (3개 더 많음) |
| **기능 완성도** | ⚠️ CRUD + QR 생성 + 페이지네이션 (QR **스캔** 미구현) | ⚠️ CRUD만 구현 (QR 스캔/생성 모두 미구현) | 양측 모두 핵심 누락 |
| **언어** | JavaScript (CommonJS) | TypeScript (ESM) | B조 (타입 안전성) |

**분석 노트:**
> 핵심 요구사항인 **"QR code 스캔해서 화면에 띄우는"** 기능을 **양측 모두 구현하지 못했다.** A조는 QR 코드를 "생성"하는 기능을 만들었으나, 이는 요구사항의 "스캔"(카메라로 QR을 읽는 기능)과 다른 기능이다. B조는 QR 관련 기능 자체가 없다.
> - **A조(Addy)**: 1,049줄, 높은 UI 완성도 (글래스모피즘, 다크 모드, 애니메이션), QR 코드 **생성**(≠스캔). 문서 4개.
> - **B조(TheScripture)**: 745줄의 간결한 코드, **13개의 설계 문서** 생성. QR 관련 기능 전무.

---

## 2. 할루시네이션 및 요구사항 충실도 (Semantic Anchoring)

> **연구 연계:** AI가 단어의 의미(Semantic)를 임의로 왜곡하거나 확장했는지 검증하는 핵심 지표입니다.

### 2.1 Scope Creep 유형 분류 및 발생 건수

| Scope Creep 유형 | Addy (A조) | TheScripture (B조) |
|:---|:---|:---|
| **의미 왜곡형** (예: "스캔"을 "생성"으로 오역) | ❌ **"스캔해서"를 "QR 코드 생성하여 표시"로 완전 오역.** 요구사항은 카메라로 QR을 **읽는(스캔)** 기능인데, 서버 URL을 QR 이미지로 **만드는(생성)** 기능을 구현. 동사의 방향이 정반대 (입력→출력 vs 출력→입력) | ❌ 홈페이지에 "📱 QR Code Board" 텍스트만 표시. QR 스캔도, QR 생성도 없음. **"QR code"라는 명사 자체가 코드에서 증발** |
| **기능 추가형** | ⚠️ QR 코드 **생성** 기능은 요구사항에 없는 기능을 추가한 것 | ✅ 없음 |
| **코드 생략형** | ❌ **QR 스캔 기능 누락** — 카메라 접근, QR 디코딩, 스캔 결과 표시 로직 전무 | ❌ **QR 스캔 기능 누락** — 동일하게 카메라/스캔 관련 코드 전무 |
| **기계적 맹점형** | ⚠️ "스캔해서 화면에 띄우는"을 "QR을 화면에 띄우는"으로 축약 해석 — 동사 "스캔" 탈락 | ⚠️ benchmark-result.md에 "메인 카메라 QR 스캔 화면 렌더링"이 ✅로 표시되어 있으나, 실제 코드에서는 구현되지 않음 → **자체 평가와 실제 코드 불일치** |

### 2.2 의미론적 충실도 (Verb/Noun Fidelity)

| 핵심 단어 (Target) | Addy (A조) 구현 방식 | TheScripture (B조) 구현 방식 | 판정 |
|:---|:---|:---|:---:|
| **"QR code"** | `qrcode` npm 패키지로 QR 코드 **생성**(≠스캔). 요구사항과 다른 기능 | QR 관련 기능 전무 | **양측 모두 미충족** |
| **"스캔해서"** | ❌ 카메라 QR 스캔 기능 없음. QR 생성은 "스캔"이 아님 | ❌ 카메라 QR 스캔 기능 없음 | **양측 모두 미충족** |
| **"화면에 띄우는"** | QR 생성 이미지를 표시 (스캔 결과 표시가 아님) | 텍스트만 표시 | **양측 모두 미충족** |
| **"홈페이지"** | `/` 라우트에 QR 생성 이미지 + 바로가기 카드 UI 구현 | `/` 라우트에 간단한 카드 UI 구현 | A조 (UI 우수) |
| **"게시판 1개"** | 게시판 CRUD + 페이지네이션 완벽 구현 | 게시판 CRUD 완벽 구현 (페이지네이션 없음) | A조 |

### 2.3 Scope 제외 명세 검증

| 제외 항목 | Addy (A조) | TheScripture (B조) |
|:---|:---:|:---:|
| 로그인/인증 기능 | ❌ 언급 없음 | ✅ 문서에서 명시적 미포함 (req.md에 미기재 → 비구현) |
| 작성자(author) 필드 | ✅ 구현됨 (기본값 "익명") | ❌ **작성자 필드 없음** — DB 스키마에 author 칼럼 부재 |
| 페이지네이션 | ✅ 구현됨 (10건 단위) | ❌ 미구현 (`getAllPosts()` 전체 조회만) |

---

## 3. 방법론 및 산출물 구조 비교

### 3.1 요구사항 해석 프로세스

* **Addy (A조):** `autoRun_addy.md` → PRD 작성 → ADR 결정 → Task Breakdown → 코드 구현 → 테스트 → 벤치마크 (4단계 산출물)
* **TheScripture (B조):** `autoRun_theScripture.md` → 7 Phase 방법론 (들음 → 기초 → 질서 → 회개 → 광야 → 기록되었으되 → 구원) → 13개 산출물 문서 → 코드 구현 → 테스트 → 감사보고

### 3.2 전체 폴더 트리 비교

**Addy (A조)**
```text
F:\qrCodeBoard_Addy\
├── src/
│   ├── index.js          (60줄 — 서버 진입점)
│   ├── db.js             (161줄 — DB 초기화 + CRUD)
│   ├── routes/
│   │   ├── home.js       (36줄)
│   │   └── board.js      (141줄)
│   └── views/
│       ├── layout.js     (188줄 — 공통 레이아웃)
│       ├── home.js       (60줄)
│       └── board/
│           ├── list.js   (112줄)
│           ├── detail.js (86줄)
│           └── form.js   (99줄)
├── tests/
│   ├── db.test.js        (127줄 — 12 테스트)
│   └── routes.test.js    (153줄 — 13 테스트)
├── docs/
│   ├── PRD.md
│   ├── task-breakdown.md
│   └── decisions/
│       ├── ADR-001-tech-stack.md
│       └── ADR-002-api-design.md
├── data/                  (SQLite DB 저장)
├── public/                (비어 있음)
├── package.json
└── req.md
```

vs

**TheScripture (B조)**
```text
F:\qrCodeBoard_TheScripture\
├── the-scripture-aidd/
│   ├── fruit-열매/        ← 실행 가능 코드
│   │   ├── src/
│   │   │   ├── index.ts       (29줄 — 서버 진입점)
│   │   │   ├── db/
│   │   │   │   └── database.ts (81줄 — DB + CRUD)
│   │   │   ├── services/
│   │   │   │   └── boardService.ts (57줄 — 비즈니스 로직)
│   │   │   ├── routes/
│   │   │   │   ├── home.tsx    (22줄)
│   │   │   │   └── board.tsx   (181줄)
│   │   │   └── views/
│   │   │       ├── layout.tsx  (58줄)
│   │   │       ├── home.tsx    (31줄)
│   │   │       └── board/
│   │   │           ├── list.tsx   (67줄)
│   │   │           ├── detail.tsx (57줄)
│   │   │           └── form.tsx   (92줄)
│   │   ├── test/
│   │   │   └── board.test.ts  (185줄 — 22 테스트)
│   │   └── package.json
│   ├── bible-성경/         ← 13개 설계 산출물
│   │   ├── 01.requirement-hearing-들음/ (3 파일)
│   │   ├── 02.architecture-foundation-기초/ (3 파일)
│   │   ├── 03.design-order-질서/ (2 파일)
│   │   ├── 04.development-repentance-회개/ (2 파일)
│   │   ├── 05.test-wilderness-광야/ (1 파일)
│   │   ├── 06.quality-written-기록되었으되/ (1 파일)
│   │   └── 07.deploy-salvation-구원/ (1 파일)
│   ├── hearing-들음/       ← req.md 원본
│   ├── statute-율법/       ← 7 Phase 템플릿 (17 파일)
│   ├── book-경전/          ← 방법론 문서 (5 파일)
│   └── parable-비유/       ← 7 Phase 구조
└── benchmark-result.md
```

---

## 4. 아키텍처 밀도 및 설계 비교

### 4.1 프로젝트 구조 분리도

| 항목 | Addy (A조) | TheScripture (B조) | 우위 |
|:---|:---|:---|:---:|
| **라우트(Route) 분리** | ✅ `home.js`, `board.js` 분리 | ✅ `home.tsx`, `board.tsx` 분리 | 동등 |
| **뷰(View) 분리** | ✅ `layout.js`, `home.js`, `board/list,detail,form.js` | ✅ `layout.tsx`, `home.tsx`, `board/list,detail,form.tsx` | 동등 |
| **서비스(Service) 계층** | ❌ 없음 — 라우트에서 DB 직접 호출 | ✅ `boardService.ts` 별도 계층 | **B조** |
| **DB 계층 분리** | `db.js` 1파일에 초기화 + CRUD | `db/database.ts` 별도 디렉토리 | B조 (구조적) |
| **타입 시스템** | ❌ JavaScript (런타임 타입 오류 가능) | ✅ TypeScript + 인터페이스 정의 (`Post`, `PostInput`, `ValidationResult`) | **B조** |
| **JSX 사용** | ❌ 템플릿 리터럴 (문자열 조합) | ✅ Hono JSX (컴파일 타임 검증) | **B조** |

---

## 5. 코딩 품질 및 무결성 방어 전수 검증 (Code Deep Dive)

### 5-1. 진입점 및 에러 핸들링 (Robustness)

| 항목 | Addy (A조) | TheScripture (B조) | 우위 |
|:---|:---|:---|:---:|
| **전역 에러 핸들러** | ✅ `app.onError()` — 500 HTML 반환, 스택 미노출 | ❌ 없음 — 전역 에러 핸들러 미설정 | **A조** |
| **404 핸들러** | ✅ `app.notFound()` — 커스텀 404 HTML | ❌ 없음 — Hono 기본 404 | **A조** |
| **라우트 예외 래핑(try-catch)** | ❌ 없음 — `app.onError()`에 위임 | ✅ **모든 라우트 핸들러**에 try-catch 적용 (7개 라우트 전부) | **B조** |
| **HTTP 에러 코드 규격** | ✅ 422 (유효성 실패), 404, 302 정확한 코드 사용 | ✅ 400 (유효성 실패), 404, 500, 302 정확한 코드 사용 | 동등 |
| **잘못된 ID 형식 처리** | ✅ `isNaN(id)` 체크 → 404 반환 | ✅ `isNaN(id)` 체크 → 400 반환 | B조 (400이 더 정확) |

**코드 증거:**

A조 — 전역 에러 핸들러 (있음):
```javascript
// src/index.js:34-47
app.onError((err, c) => {
  console.error('[서버 에러]', err.message);
  return c.html(`...⚠️ 오류가 발생했습니다...`, 500);
});
```

B조 — 라우트별 try-catch (있음), 전역 핸들러 (없음):
```typescript
// src/routes/board.tsx:16-28
boardRoutes.get('/', (c) => {
  try {
    const posts = listPosts();
    return c.html(/* ... */);
  } catch (err) {
    console.error('게시판 목록 조회 에러:', err);
    return c.text('데이터를 불러올 수 없습니다.', 500);
  }
});
```

> [!WARNING]
> **B조 위험 노출**: 전역 에러 핸들러가 없어, try-catch로 감싸지 않은 미래의 라우트가 추가될 경우 500 에러가 스택 트레이스와 함께 노출될 위험이 있다. 반면 A조는 글로벌 세이프티넷이 있어 방어적이다.

### 5-2. 데이터베이스 레이어 (Integrity)

| 항목 | Addy (A조) | TheScripture (B조) | 우위 |
|:---|:---|:---|:---:|
| **DB 레벨 무결성 방어** | ❌ `NOT NULL`만 사용. `CHECK` 제약조건 없음 | ✅ `CHECK(length(trim(title)) > 0)`, `CHECK(length(trim(content)) > 0)` — DB 레벨에서 빈 문자열/공백 방어 | **B조** |
| **WAL 모드** | ✅ `db.pragma('journal_mode = WAL')` | ✅ `db.pragma('journal_mode = WAL')` | 동등 |
| **Foreign Keys** | ✅ `db.pragma('foreign_keys = ON')` | ❌ 미설정 | A조 |
| **인덱스** | ❌ 없음 | ✅ `CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC)` | **B조** |
| **삭제 검증** | ✅ `result.changes > 0` 확인 후 boolean 반환 | ✅ `result.changes > 0` 확인 후 boolean 반환 | 동등 |
| **수정 검증** | ⚠️ `stmt.run()` 후 `getPost(id)` 재조회 반환 — changes 미확인 | ✅ `result.changes > 0` 확인 후 boolean 반환 | **B조** |
| **테스트 DB 격리** | ✅ `initTestDatabase()` — 인메모리 DB 사용 | ❌ **실제 DB(`qrboard.db`) 직접 사용** — 테스트가 프로덕션 데이터를 오염시킴 | **A조** |

**코드 증거 — DB CHECK 제약조건:**

A조 — CHECK 없음:
```javascript
// src/db.js:28-37
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT '익명',
  ...
);
```

B조 — CHECK 적용:
```typescript
// src/db/database.ts:21-29
CREATE TABLE IF NOT EXISTS posts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT    NOT NULL CHECK(length(trim(title)) > 0),
  content    TEXT    NOT NULL CHECK(length(trim(content)) > 0),
  ...
);
```

> [!IMPORTANT]
> B조의 `CHECK` 제약조건은 **DB 레벨 방어 깊이(Defense in Depth)**의 핵심이다. 서버 검증을 우회하더라도 DB가 무결성을 사수한다. A조는 서버 검증만으로 방어하므로, 직접 DB 접근 시 빈 제목/내용이 삽입될 수 있다.

### 5-3. 프론트엔드 및 방어 문서화 (Defense in Depth)

| 항목 | Addy (A조) | TheScripture (B조) | 우위 |
|:---|:---|:---|:---:|
| **HTML 1층 방어 (`required`)** | ✅ `required`, `maxlength="200"` | ✅ `required` | A조 (`maxlength` 추가) |
| **HTML `maxlength` 속성** | ✅ title=200, author=50, content=10000 | ❌ 미설정 | **A조** |
| **서버 2층 방어 (유효성 검증)** | ✅ 빈 제목/200자 초과 검증 → 422 반환 | ✅ `validatePostInput()` — 빈 제목/내용 검증 → 400 반환 | 동등 |
| **XSS 방지** | ✅ 수동 `escapeHtml()` 함수로 `&<>"'` 이스케이프 | ✅ Hono JSX 자동 이스케이프 (프레임워크 레벨 보호) | **B조** (자동화) |
| **HTMX 실제 활용** | ⚠️ CDN 로드만 — HTMX 속성(`hx-*`) 실제 사용 없음 | ⚠️ CDN 로드만 — HTMX 속성 실제 사용 없음 | 동등 (양측 미활용) |
| **Alpine.js 실제 활용** | ✅ 폼 제출 로딩 상태, 삭제 확인 dialog | ⚠️ `x-data` 선언만 — 실제 로직 미사용 | **A조** |
| **명시적 방어 문서화** | ❌ 코드 주석 수준 | ✅ `security-seal-봉인.md`, `defense-armor-마귀요리법.md` 등 방어 전략 문서화 | **B조** |

**코드 증거 — XSS 방어:**

A조 — 수동 이스케이프:
```javascript
// src/views/layout.js:177-184
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
```

B조 — Hono JSX 자동:
```tsx
// src/views/board/detail.tsx:23
<h1 class="text-2xl font-bold text-slate-800 mb-3">{post.title}</h1>
// JSX는 자동으로 XSS 이스케이프 처리
```

### 5-4. UI/UX 품질 비교

| 항목 | Addy (A조) | TheScripture (B조) | 우위 |
|:---|:---|:---|:---:|
| **디자인 테마** | 🌑 다크 모드 (slate-950 ~ indigo-950 그라디언트) | ☀️ 라이트 모드 (slate-50 기반) | 취향 (A조가 더 세련) |
| **글래스모피즘** | ✅ `glass-card` — backdrop-filter: blur(16px) | ❌ 없음 — 표준 white 카드 | **A조** |
| **애니메이션** | ✅ `fadeInUp`, `pulse-glow`, `hover-lift`, loading spinner | ❌ 없음 — 정적 UI | **A조** |
| **그라디언트 텍스트** | ✅ `.gradient-text` — 3색 인디고 그라디언트 | ❌ 없음 | **A조** |
| **Google Fonts** | ✅ Inter + Pretendard | ✅ Inter | A조 (폴백 추가) |
| **반응형 디자인** | ✅ `sm:`, `md:` 브레이크포인트, `hidden sm:table-cell` | ✅ `md:` 브레이크포인트만 | A조 (더 세밀) |
| **빈 상태 UI** | ✅ 📭 이모지 + "첫 글 작성하기" 버튼 | ✅ 📝 이모지 + "첫 글을 작성해보세요 →" 링크 | 동등 |
| **커스텀 스크롤바** | ✅ 웹킷 스크롤바 스타일링 | ❌ 없음 | **A조** |

---

## 6. 테스트 품질 및 역가설 검증

| 항목 | Addy (A조) | TheScripture (B조) | 우위 |
|:---|:---|:---|:---:|
| **테스트 격리(TEST_DB 등)** | ✅ `initTestDatabase()` — `:memory:` 인메모리 DB | ❌ 실제 `qrboard.db` 파일에 직접 쓰기 | **A조** |
| **역가설 검증 (400/404 등)** | ✅ 빈 제목 → 422, 200자 초과 → 422, 존재하지 않는 ID → 404, 잘못된 ID 형식 → 404 | ✅ 빈 제목 → 400, 빈 내용 → 400, 존재하지 않는 ID → 404, 존재하지 않는 삭제 → 404 | 동등 |
| **앱 인스턴스 import 방식** | ✅ 테스트 전용 Hono 앱 재조합 (`new Hono()` + `boardRouter` 등록) — 서버 시작 없이 테스트 | ⚠️ `import app from '../src/index.js'` — 실제 앱 직접 import (서버 구동 코드 포함, `serve()` 호출됨) | **A조** |
| **DB CHECK 제약 테스트** | ❌ 없음 | ✅ 빈 제목/내용/공백 제목 → `assert.throws()` 3개 테스트 | **B조** |
| **업데이트 실패 테스트** | ❌ 없음 | ✅ 존재하지 않는 게시글 수정 → false 검증 | **B조** |
| **삭제 실패 테스트** | ✅ 존재하지 않는 게시글 삭제 → false | ✅ 존재하지 않는 게시글 삭제 → false | 동등 |

> [!WARNING]
> **B조 테스트 격리 문제**: B조는 `import app from '../src/index.js'`로 앱을 import하는데, 이 모듈의 최상위 스코프에서 `const db = new Database(DB_PATH)`와 `db.exec(CREATE TABLE ...)`이 실행된다. 따라서 **테스트를 실행할 때마다 실제 DB 파일(`qrboard.db`)에 테스트 데이터가 누적**되어 프로덕션 데이터를 오염시킨다. 이는 심각한 설계 결함이다.

---

## 7. IRONCLAD 감사 결과표 (TheScripture 방법론 적용 시)

| 감사 도메인 | A조 (Addy) | B조 (TheScripture) | 비고 |
|:---|:---:|:---:|:---|
| 할루시네이션 (기능 추가/누락) | ❌ QR 스캔을 QR **생성**으로 의미 왜곡 + QR 스캔 누락 | ❌ **QR 코드 전체 미구현** — 핵심 요구사항 누락 | **양측 모두 핵심 요구사항 미충족.** B조 benchmark에는 "✅"로 기록됨 |
| RTM (요구사항) 추적성 100% | ⚠️ PRD에 추적 (비공식) | ✅ `rtm-covenant-언약추적.md` 공식 문서 존재 | B조가 **형식적으로** 우수하나, QR 누락으로 실질 추적 불완전 |
| 예외처리 강건성 (전 라우트 방어) | ✅ 전역 에러 핸들러로 전체 방어 | ✅ 라우트별 try-catch 전체 적용 | 양측 모두 방어적 |
| DB 무결성 방어 | ⚠️ `NOT NULL`만 | ✅ `CHECK` 제약조건 | B조 우수 |
| 테스트 격리 | ✅ 인메모리 DB | ❌ 프로덕션 DB 직접 사용 | A조 우수 |
| 자체 벤치마크 정직성 | ⚠️ QR 생성을 QR 구현으로 기록 (의미 왜곡 미인지) | ❌ **"메인 카메라 QR 스캔 화면 렌더링 ✅"** — 실제 미구현 기능을 완성으로 기록 | **양측 모두 부정확** |

---

## 8. 종합 평가 및 결론

### Addy (A조) 요약
- **강점:**
  - 🎨 **프리미엄 UI** — 다크 모드 글래스모피즘, 그라디언트 텍스트, fadeInUp/pulse-glow 애니메이션
  - 🛡️ **전역 에러 핸들러** — `app.onError()` + `app.notFound()`로 글로벌 세이프티넷 확보
  - 🧪 **테스트 격리** — 인메모리 DB로 프로덕션 데이터 보호
  - 📖 **페이지네이션** — 10건 단위 페이지 분할, 이전/다음 네비게이션
  - ✍️ **작성자(author) 필드** — 기본값 "익명"으로 사용자 편의 제공
  - 🔐 **XSS 수동 방어** — `escapeHtml()` 5가지 특수문자 이스케이프
  - ⚡ **Alpine.js 실제 활용** — 폼 제출 로딩 상태 표시
- **약점:**
  - ❌ **QR 스캔 미구현** — "스캔해서"를 "생성하여"로 의미 왜곡. 카메라 QR 리더 기능 없음
  - ❌ JavaScript → 런타임 타입 오류 가능
  - ❌ 서비스 레이어 없음 — 라우트에서 DB 직접 호출 (관심사 분리 부족)
  - ❌ DB `CHECK` 제약조건 없음 — DB 레벨 방어 미흡
  - ❌ 산출물 문서 4개로 적음

### TheScripture (B조) 요약
- **강점:**
  - 📚 **13개 설계 산출물** — 7 Phase 방법론에 따른 체계적 문서화
  - 🏗️ **서비스 레이어 분리** — `boardService.ts`로 비즈니스 로직 캡슐화
  - 📐 **TypeScript** — 타입 안전성, 인터페이스 정의 (`Post`, `PostInput`, `ValidationResult`)
  - 🛡️ **DB CHECK 제약조건** — `CHECK(length(trim(title)) > 0)` DB 레벨 무결성 방어
  - 🏷️ **Hono JSX** — 자동 XSS 이스케이프, 컴파일 타임 검증
  - 🗂️ **DB 인덱스** — `idx_posts_created_at` 성능 최적화
  - 🔒 **라우트별 try-catch** — 모든 핸들러에 예외 처리
  - ✅ **DB CHECK 제약 테스트** — 빈 제목/내용/공백 제목에 대한 역가설 검증
- **약점:**
  - ❌ **QR 코드 전체 미구현** — 스캔도, 생성도 없음. `package.json`에 QR 관련 의존성 없음
  - ❌ **벤치마크 자체 평가 부정확** — 미구현 기능을 "✅"로 기록
  - ❌ **테스트 격리 없음** — 프로덕션 DB(`qrboard.db`)에 직접 쓰기
  - ❌ **전역 에러 핸들러 없음** — 미래 라우트 추가 시 안전망 부재
  - ❌ **페이지네이션 없음** — 게시글이 많아지면 성능/UX 저하
  - ❌ **작성자 필드 없음** — DB 스키마에 author 칼럼 부재
  - ❌ **UI가 단조로움** — 라이트 모드, 정적 UI, 애니메이션 없음

### 💡 트레이드오프 및 추천

> **이번 벤치마크의 핵심 발견:**

| 평가 축 | 우위 | 근거 |
|:---|:---:|:---|
| **QR 스캔 (핵심 요구사항)** | **양측 모두 실패** | A조는 "생성"으로 의미 왜곡, B조는 QR 전체 미구현 |
| **코드 품질 (타입 안전성)** | **B조** | TypeScript + 인터페이스 vs JavaScript |
| **아키텍처 밀도** | **B조** | 서비스 레이어 분리, JSX 사용 |
| **DB 무결성** | **B조** | CHECK 제약조건, 인덱스 |
| **에러 핸들링 (글로벌)** | **A조** | 전역 에러/404 핸들러 vs 없음 |
| **테스트 안전성** | **A조** | 인메모리 격리 vs 프로덕션 DB 오염 |
| **UI/UX 품질** | **A조** | 글래스모피즘, 애니메이션 vs 단조로운 정적 UI |
| **문서화 체계** | **B조** | 13개 산출물 vs 4개 |
| **자체 평가 신뢰성** | **양측 모두 부정확** | A조: 생성≠스캔 미인지, B조: 미구현을 ✅로 기록 |

> **결론:**
>
> - **양측 모두 핵심 요구사항인 "QR code 스캔" 기능을 구현하지 못했다.** A조는 QR 코드 "생성"(서버 URL을 QR 이미지로 변환)을 구현했으나 이는 요구사항의 "스캔"(카메라로 QR을 읽어 결과를 화면에 표시)과 **정반대 방향의 기능**이다. B조는 QR 관련 기능 자체가 없다.
>
> - **게시판 CRUD 완성도**에서는 A조가 우위다. 페이지네이션, 작성자 필드, 프리미엄 UI, 테스트 격리 등 부가 기능이 충실하다.
>
> - **구조적 품질**에서는 B조가 우위다. TypeScript, 서비스 레이어 분리, DB CHECK 제약조건, 13개 설계 문서 등 장기 유지보수 기반이 견고하다.
>
> - **최종 판정:** 핵심 요구사항(QR 스캔) 기준으로는 **양측 모두 미완성**이다. 부가적 품질(게시판 완성도, UI, 테스트)에서는 A조, 아키텍처·문서화에서는 B조가 각각 우위를 점한다. **Claude Opus 4.6 모델도 "스캔"이라는 동사의 정확한 의미를 코드로 변환하는 데 실패**했으며, 이는 요구사항의 모호성("구글 QR code 스캔해서")과 AI의 의미 해석 한계가 결합된 결과다.
