# 👁️ 화면 설계서 — QR Code 게시판 홈페이지

> *"In the visions of God brought he me into the land of Israel."* — Ezekiel 40:2 (KJV)

---

## 화면 목록

| SCR-ID | 화면명 | 라우팅 경로 | 연결 UC | 연결 REQ | 인증 |
|:---|:---|:---|:---|:---|:---:|
| SCR-001 | 홈페이지 | / | UC-001 | REQ-001, FR-001 | ❌ |
| SCR-002 | 게시판 목록 | /board | UC-002 | REQ-002, FR-002 | ❌ |
| SCR-003 | 게시글 상세 | /board/:id | UC-003 | REQ-002, FR-003 | ❌ |
| SCR-004 | 글 작성 폼 | /board/new | UC-004 | REQ-002, FR-004 | ❌ |
| SCR-005 | 글 수정 폼 | /board/:id/edit | UC-005 | REQ-002, FR-005 | ❌ |

> 삭제(UC-006)는 별도 화면 없이 SCR-003(상세)에서 POST 요청으로 처리.

---

## 화면 상세

### SCR-001: 홈페이지

| 항목 | 내용 |
|:---|:---|
| Screen-ID | SCR-001 |
| 화면명 | 홈페이지 |
| 경로 | / |
| 연결 UC | UC-001 |
| 인증 | 불필요 |

**레이아웃 구성:**

| 영역 | 컴포넌트 | 설명 |
|:---|:---|:---|
| Header | Logo + NavLink | "QR Code Board" 로고 + 게시판 링크 |
| Hero | HeroSection | 환영 메시지 + 게시판 바로가기 버튼 |
| Footer | FooterInfo | 저작권 정보 |

**인터랙션:**

| 이벤트 | 동작 | 연결 API |
|:---|:---|:---|
| "게시판 바로가기" 클릭 | /board 로 이동 | — |
| 헤더 "게시판" 클릭 | /board 로 이동 | — |

---

### SCR-002: 게시판 목록

| 항목 | 내용 |
|:---|:---|
| Screen-ID | SCR-002 |
| 화면명 | 게시판 목록 |
| 경로 | /board |
| 연결 UC | UC-002 |
| 인증 | 불필요 |

**레이아웃 구성:**

| 영역 | 컴포넌트 | 설명 |
|:---|:---|:---|
| Header | Logo + NavLink | 공통 헤더 |
| Main | PageTitle | "📋 게시판" + 글쓰기 버튼 |
| Main | PostTable | 게시글 목록 테이블 (번호, 제목, 작성일) |
| Main | EmptyState | 게시글 0건 시 "등록된 게시글이 없습니다" |

**인터랙션:**

| 이벤트 | 동작 | 연결 API |
|:---|:---|:---|
| 글쓰기 버튼 클릭 | /board/new 로 이동 | — |
| 게시글 제목 클릭 | /board/:id 로 이동 | — |
| 페이지 로드 | GET /board → 목록 조회 | API-002 |

**상태 처리:**

| 상태 | 표시 |
|:---|:---|
| 로딩 | — (SSR이므로 로딩 없음) |
| 빈 목록 | "등록된 게시글이 없습니다." + 글쓰기 안내 |
| 에러 | "데이터를 불러올 수 없습니다." |

---

### SCR-003: 게시글 상세

| 항목 | 내용 |
|:---|:---|
| Screen-ID | SCR-003 |
| 화면명 | 게시글 상세 |
| 경로 | /board/:id |
| 연결 UC | UC-003, UC-006 |
| 인증 | 불필요 |

**레이아웃 구성:**

| 영역 | 컴포넌트 | 설명 |
|:---|:---|:---|
| Header | Logo + NavLink | 공통 헤더 |
| Sub | BackLink | "← 목록으로" 링크 |
| Main | PostTitle | 게시글 제목 |
| Main | PostMeta | 작성일, 수정일 |
| Main | PostContent | 게시글 본문 (줄바꿈 유지) |
| Footer | ActionButtons | 수정 버튼 + 삭제 버튼 |

**인터랙션:**

| 이벤트 | 동작 | 연결 API |
|:---|:---|:---|
| "← 목록으로" 클릭 | /board 로 이동 | — |
| 수정 버튼 클릭 | /board/:id/edit 로 이동 | — |
| 삭제 버튼 클릭 | confirm 확인 → POST /board/:id/delete → /board 리다이렉트 | API-008 |

**상태 처리:**

| 상태 | 표시 |
|:---|:---|
| 게시글 없음 (404) | "게시글을 찾을 수 없습니다." + 목록 링크 |

---

### SCR-004: 글 작성 폼

| 항목 | 내용 |
|:---|:---|
| Screen-ID | SCR-004 |
| 화면명 | 글 작성 |
| 경로 | /board/new |
| 연결 UC | UC-004 |
| 인증 | 불필요 |

**레이아웃 구성:**

| 영역 | 컴포넌트 | 설명 |
|:---|:---|:---|
| Header | Logo + NavLink | 공통 헤더 |
| Sub | BackLink | "← 취소" 링크 (목록으로) |
| Main | FormTitle | "📝 새 글 작성" |
| Main | TitleInput | 제목 입력 필드 (required) |
| Main | ContentTextarea | 내용 입력 필드 (textarea, required) |
| Footer | FormButtons | 취소 버튼 + 저장 버튼 |

**인터랙션:**

| 이벤트 | 동작 | 연결 API |
|:---|:---|:---|
| 저장 버튼 클릭 | POST /board → 성공 시 /board 리다이렉트 | API-005 |
| 취소 버튼 클릭 | /board 로 이동 | — |
| 빈 필드 제출 | HTML required → 브라우저 검증 | — |

---

### SCR-005: 글 수정 폼

| 항목 | 내용 |
|:---|:---|
| Screen-ID | SCR-005 |
| 화면명 | 글 수정 |
| 경로 | /board/:id/edit |
| 연결 UC | UC-005 |
| 인증 | 불필요 |

**레이아웃 구성:**

| 영역 | 컴포넌트 | 설명 |
|:---|:---|:---|
| Header | Logo + NavLink | 공통 헤더 |
| Sub | BackLink | "← 취소" 링크 (상세로) |
| Main | FormTitle | "✏️ 글 수정" |
| Main | TitleInput | 제목 입력 필드 (기존값 채움, required) |
| Main | ContentTextarea | 내용 입력 필드 (기존값 채움, required) |
| Footer | FormButtons | 취소 버튼 + 저장 버튼 |

**인터랙션:**

| 이벤트 | 동작 | 연결 API |
|:---|:---|:---|
| 저장 버튼 클릭 | POST /board/:id/edit → 성공 시 /board/:id 리다이렉트 | API-007 |
| 취소 버튼 클릭 | /board/:id 로 이동 | — |

---

## UC-화면 중복 해체 검증

| UC-ID | 매핑 화면 | 핵심 기능 | 다른 UC/화면과 기능 중복 여부 | 처리 |
|:--|:--|:--|:--|:--|
| UC-001 | SCR-001 | 홈페이지 접속 | ❌ 없음 | 독립 |
| UC-002 | SCR-002 | 글 목록 조회 | ❌ 없음 | 독립 |
| UC-003 | SCR-003 | 글 상세 보기 | ❌ 없음 | 독립 |
| UC-004 | SCR-004 | 글 작성 | ⚠️ SCR-005(수정 폼)과 폼 구조 유사 | 동일 컴포넌트(form.tsx)로 통합, mode 파라미터로 분기 |
| UC-005 | SCR-005 | 글 수정 | ⚠️ SCR-004(작성 폼)과 폼 구조 유사 | 동일 컴포넌트(form.tsx)로 통합, mode 파라미터로 분기 |
| UC-006 | SCR-003 (내) | 글 삭제 | ❌ 없음 (SCR-003 내 삭제 버튼) | SCR-003에 통합 |

> ✅ 중복 해체 완료: SCR-004와 SCR-005는 동일 form.tsx 컴포넌트를 공유하되, 라우트와 mode로 분기.

---

## 라우팅 가드

| 경로 | 인증 필요 | 가드 |
|:---|:---:|:---|
| / | ❌ | 없음 — 공개 |
| /board | ❌ | 없음 — 공개 |
| /board/new | ❌ | 없음 — 공개 |
| /board/:id | ❌ | 없음 — 공개 |
| /board/:id/edit | ❌ | 없음 — 공개 |
| /board/:id/delete | ❌ | 없음 — 공개 (POST only) |

---

## 반응형 디자인

| 디바이스 | 최소 너비 | 레이아웃 변경 |
|:---|:---:|:---|
| Mobile | 0px | 1컬럼, 패딩 16px, 테이블 → 카드형 |
| Tablet | 768px | 중앙 정렬 시작, max-width 700px |
| Desktop | 1024px | 중앙 정렬, max-width 800px |

---

## 접근성

| 항목 | 적용 |
|:---|:---|
| 색상 대비 | 4.5:1 이상 (WCAG AA) ✅ |
| 키보드 | Tab으로 전체 네비게이션 가능 |
| 스크린리더 | aria-label, role 적용 |
| 폼 | label + for 연결, required 속성 |
