# 👁️ 화면 설계서 (환상) — QR코드 게시판 (The Scripture)

> **bible-성경/03.design-order-질서/screen-vision-화면설계.md**

---

## 1. UC-화면 중복 해체 검증

| UC-ID | 매핑 화면 | 핵심 기능 | 다른 UC/화면과 기능 중복 여부 | 처리 |
|:--|:--|:--|:--|:--|
| UC-001 | SCR-001 (홈) | QR 스캐너 진입점, 카메라 권한 요청 | ❌ 없음 | 독립 |
| UC-002 | SCR-001 (홈) | QR 코드 스캔 + 결과 표시 | ❌ UC-001과 같은 화면이나 다른 인터랙션 영역 | 동일 화면 내 분리된 영역 |
| UC-003 | SCR-002 (게시판 목록) | 게시글 목록 조회 | ❌ 없음 | 독립 |
| UC-004 | SCR-004 (게시글 상세) | 게시글 상세 조회 | ❌ 없음 | 독립 |
| UC-005 | SCR-003 (게시글 작성) | 게시글 작성 폼 + 저장 | ❌ 없음 | 독립 |

> ✅ 중복 0건. UC-001과 UC-002는 홈 화면(SCR-001)을 공유하나 기능 영역이 분리됨 (진입 vs 스캔 인터랙션).

---

## 2. 화면 목록

| SCR-ID | 화면명 | 라우팅 경로 | 연결 UC | 연결 REQ | 인증 필요 |
|:---|:---|:---|:---|:---|:---:|
| SCR-001 | 홈 (QR 스캐너) | / | UC-001, UC-002 | REQ-001, REQ-002, REQ-003 | ❌ |
| SCR-002 | 게시판 목록 | /board | UC-003 | REQ-004 | ❌ |
| SCR-003 | 게시글 작성 | /board/new | UC-005 | REQ-005 | ❌ |
| SCR-004 | 게시글 상세 | /board/:id | UC-004 | REQ-006 | ❌ |

---

## 3. 화면 상세 명세

### SCR-001: 홈 (QR 스캐너)

| 항목 | 내용 |
|:---|:---|
| Screen-ID | SCR-001 |
| 화면명 | 홈 (QR 스캐너) |
| 경로 | / |
| 연결 UC | UC-001, UC-002 |
| 연결 REQ | REQ-001, REQ-002, REQ-003 |
| 인증 | 불필요 |
| Hono JSX 파일 | `src/views/home/index.tsx` |
| 라우트 파일 | `src/routes/home.ts` |

**레이아웃 구성:**

| 영역 | 컴포넌트 | 설명 |
|:---|:---|:---|
| Header | NavBar | 로고 + "게시판" 링크 네비게이션 |
| Main | QRScannerSection | QR 스캐너 전체 영역 (Alpine.js x-data) |
| Main > QRScanner | VideoViewfinder | `<video>` 태그 카메라 스트림 (450x300) |
| Main > QRScanner | ScanBorder | 스캐너 모서리 애니메이션 |
| Main > Result | ResultBox | 스캔 결과 표시 영역 (x-show) |
| Main | GuideText | "카메라를 QR코드에 가져다 대세요" |
| Main | ErrorMessage | 카메라 오류 시 표시 (x-show) |

**인터랙션:**

| 이벤트 | 동작 | 연결 API |
|:---|:---|:---|
| 페이지 로드 | Alpine.js `x-init` → navigator.mediaDevices.getUserMedia() | — |
| 카메라 권한 허용 | 뷰파인더에 실시간 스트림 표시 | — |
| 카메라 권한 거부 | ErrorMessage 표시: "카메라 접근 권한이 필요합니다" | — |
| QR 코드 감지 | ResultBox에 결과 텍스트/URL 표시, 스캐너 테두리 녹색 전환 | — |
| 결과가 URL인 경우 | 클릭 가능한 `<a target="_blank">` 링크로 표시 | — |

**에러/빈/로딩 상태:**

| 상태 | 표현 |
|:---|:---|
| 로딩 (카메라 초기화) | "카메라를 불러오는 중..." + 스피너 |
| 카메라 없음 | "카메라를 찾을 수 없습니다" 경고 |
| 권한 거부 | "카메라 접근 권한이 필요합니다. 브라우저 설정을 확인하세요" |
| 스캔 대기 중 | "QR 코드를 카메라에 가져다 대세요" |

---

### SCR-002: 게시판 목록

| 항목 | 내용 |
|:---|:---|
| Screen-ID | SCR-002 |
| 화면명 | 게시판 목록 |
| 경로 | /board |
| 연결 UC | UC-003 |
| 연결 REQ | REQ-004 |
| 인증 | 불필요 |
| Hono JSX 파일 | `src/views/board/list.tsx` |
| 라우트 파일 | `src/routes/board.ts` |

**레이아웃 구성:**

| 영역 | 컴포넌트 | 설명 |
|:---|:---|:---|
| Header | NavBar | 공통 네비게이션 |
| Main Header | PageTitle | "게시판" 제목 + "글 작성" 버튼 (우측) |
| Main | PostList | 게시글 카드 목록 (반복) |
| Main > PostList | PostCard | 게시글 제목, 작성일. 클릭 시 상세로 이동 |
| Main | EmptyState | 게시글 없을 때: "등록된 게시글이 없습니다" |

**인터랙션:**

| 이벤트 | 동작 | 연결 API |
|:---|:---|:---|
| 페이지 로드 | DB에서 게시글 목록 SSR 렌더링 | API-002 |
| PostCard 클릭 | /board/:id 이동 | — |
| 글 작성 버튼 클릭 | /board/new 이동 | — |

**에러/빈 상태:**

| 상태 | 표현 |
|:---|:---|
| 게시글 없음 | EmptyState: "등록된 게시글이 없습니다. 첫 글을 작성해보세요!" |
| DB 오류 | "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." |

---

### SCR-003: 게시글 작성

| 항목 | 내용 |
|:---|:---|
| Screen-ID | SCR-003 |
| 화면명 | 게시글 작성 |
| 경로 | /board/new |
| 연결 UC | UC-005 |
| 연결 REQ | REQ-005 |
| 인증 | 불필요 |
| Hono JSX 파일 | `src/views/board/form.tsx` |
| 라우트 파일 | `src/routes/board.ts` |

**레이아웃 구성:**

| 영역 | 컴포넌트 | 설명 |
|:---|:---|:---|
| Header | NavBar | 공통 네비게이션 |
| Main | FormTitle | "새 게시글 작성" 제목 |
| Main | ErrorAlert | 서버 에러 메시지 (조건부 표시) |
| Main | TitleInput | 제목 입력 필드 (label + input, required) |
| Main | ContentTextarea | 내용 입력 필드 (label + textarea, required, rows=10) |
| Main | ButtonGroup | [취소] [등록하기] 버튼 |

**인터랙션:**

| 이벤트 | 동작 | 연결 API |
|:---|:---|:---|
| 등록하기 클릭 | POST /board (form submit) | API-004 |
| 성공 | 302 → /board | — |
| 실패 (빈 값) | 폼 재렌더링 + ErrorAlert 표시 | — |
| 취소 클릭 | /board 이동 | — |

**에러/빈 상태:**

| 상태 | 표현 |
|:---|:---|
| 유효성 실패 | ErrorAlert: "제목과 내용을 모두 입력해주세요." (role="alert") |
| DB 오류 | ErrorAlert: "저장에 실패했습니다. 다시 시도해주세요." |

---

### SCR-004: 게시글 상세

| 항목 | 내용 |
|:---|:---|
| Screen-ID | SCR-004 |
| 화면명 | 게시글 상세 |
| 경로 | /board/:id |
| 연결 UC | UC-004 |
| 연결 REQ | REQ-006 |
| 인증 | 불필요 |
| Hono JSX 파일 | `src/views/board/detail.tsx` |
| 라우트 파일 | `src/routes/board.ts` |

**레이아웃 구성:**

| 영역 | 컴포넌트 | 설명 |
|:---|:---|:---|
| Header | NavBar | 공통 네비게이션 |
| Main | BackLink | "← 목록으로" 링크 (/board) |
| Main | PostTitle | 게시글 제목 (h1) |
| Main | PostMeta | 작성일시 (회색 소형 텍스트) |
| Main | PostContent | 게시글 내용 (줄바꿈 보존: whitespace-pre-wrap) |

**인터랙션:**

| 이벤트 | 동작 | 연결 API |
|:---|:---|:---|
| 페이지 로드 | DB에서 게시글 SSR 렌더링 | API-005 |
| BackLink 클릭 | /board 이동 | — |

**에러/빈 상태:**

| 상태 | 표현 |
|:---|:---|
| 게시글 없음 (404) | "게시글을 찾을 수 없습니다." + "목록으로 돌아가기" 링크 |
| DB 오류 | "서버 오류가 발생했습니다." |

---

## 4. 라우팅 가드

| 경로 | 인증 필요 | 역할 제한 | 미충족 시 |
|:---|:---:|:---:|:---|
| / | ❌ | 없음 | — |
| /board | ❌ | 없음 | — |
| /board/new | ❌ | 없음 | — |
| /board/:id | ❌ | 없음 | 404 페이지 |

> req.md에 인증 요구사항 없음 → 전체 공개

---

## 5. 반응형 디자인

| 디바이스 | 최소 너비 | 레이아웃 |
|:---|:---:|:---|
| Mobile | 0px | `max-w-full px-4`, 전체 너비 |
| Tablet | 768px | `max-w-3xl mx-auto px-6` |
| Desktop | 1024px | `max-w-3xl mx-auto px-0` |

> QR 스캐너 뷰파인더: 모바일 시 `w-full max-w-md`, 데스크톱 시 고정 450px

---

## 6. 접근성 (WCAG 2.1 AA)

| 항목 | 구현 내용 |
|:---|:---|
| 색상 대비 | Primary #4F46E5 on White 7.4:1 ✅ |
| 폼 레이블 | `<label htmlFor="title">`, `<label htmlFor="content">` |
| 에러 공지 | `role="alert"`, `aria-live="polite"` |
| 카메라 상태 | `aria-label` 로 상태 설명 |
| 키보드 네비게이션 | 모든 버튼/링크 Tab 접근 가능 |
| 포커스 링 | `focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2` |

---

## 정경화 조건 확인

- [x] 모든 UC에서 화면이 1개 이상 정의됨
- [x] 디자인 시스템(색상, 폰트, 간격) 명시 (design-vision 참조)
- [x] 반응형 브레이크포인트 정의
- [x] 인터랙션 + 연결 API 명시
- [x] 접근성 기준 확인
- [x] UC-화면 중복 해체 검증 완료 (중복 0건)
- [x] 모든 화면이 UC에 매핑됨 (SCR-001~004 ↔ UC-001~005)
