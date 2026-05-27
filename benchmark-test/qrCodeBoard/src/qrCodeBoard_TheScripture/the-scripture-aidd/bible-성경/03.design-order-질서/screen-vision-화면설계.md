# 👁️ 화면 설계서 — QR코드 게시판

> *"In the visions of God brought he me into the land of Israel."* — Ezekiel 40:2 (KJV)

---

## 화면 목록

| SCR-ID | 화면명 | 라우팅 경로 | 연결 UC | 연결 REQ | 인증 |
|:---|:---|:---|:---|:---|:---:|
| SCR-001 | 홈페이지 (QR 스캔) | / | UC-001, UC-002 | REQ-001, REQ-002 | ❌ |
| SCR-002 | 게시판 목록 | /board | UC-003 | REQ-003 | ❌ |
| SCR-003 | 게시글 작성 | /board/new | UC-004 | REQ-003 | ❌ |
| SCR-004 | 게시글 상세 | /board/:id | UC-005 | REQ-003 | ❌ |
| SCR-005 | 게시글 수정 | /board/:id/edit | UC-006 | REQ-003 | ❌ |

---

## UC-화면 중복 해체 검증

| UC-ID | 매핑 화면 | 핵심 기능 | 다른 UC/화면과 기능 중복 여부 | 처리 |
|:--|:--|:--|:--|:--|
| UC-001 | SCR-001 | QR 코드 스캔 및 결과 표시 | ❌ 없음 | 독립 |
| UC-002 | SCR-001 | 홈페이지 접속 및 네비게이션 | UC-001과 같은 화면이나 기능 독립 (스캔 vs 네비게이션) | 통합 (하나의 화면에 두 기능) |
| UC-003 | SCR-002 | 게시글 목록 조회 | ❌ 없음 | 독립 |
| UC-004 | SCR-003 | 게시글 작성 | ❌ 없음 | 독립 |
| UC-005 | SCR-004 | 게시글 상세 조회 | ❌ 없음 | 독립 |
| UC-006 | SCR-005 | 게시글 수정 | SCR-003과 폼이 유사하나 기능 독립 (생성 vs 수정) | 분리 (진입점과 API 상이) |
| UC-007 | SCR-004 | 게시글 삭제 | SCR-004 안의 버튼 동작, 별도 화면 불필요 | 통합 (상세 화면 내 삭제 버튼) |

> ✅ 중복 해체 검증 완료. 기능 중복 0건.

---

## 디자인 시스템

| 항목 | 규격 |
|:---|:---|
| 주 색상 (Primary) | #3730a3 (인디고 — 신뢰와 안정) |
| 보조 색상 (Secondary) | #f59e0b (앰버 — QR 스캔 강조) |
| 배경색 | #f8fafc (슬레이트 화이트) |
| 폰트 | Pretendard (본문 + UI 통합) |
| 간격 (Spacing) | 4px 기반 (4, 8, 12, 16, 24, 32, 48) |
| 그리드 | 12컬럼, 거터 16px, 최대 1024px |
| 모서리 반경 | 12px (카드), 8px (버튼) |

---

## 화면 상세

### SCR-001: 홈페이지 (QR 스캔)

| 항목 | 내용 |
|:---|:---|
| Screen-ID | SCR-001 |
| 화면명 | 홈페이지 (QR 스캔) |
| 경로 | / |
| 연결 UC | UC-001 (QR 스캔), UC-002 (홈 접속) |
| 인증 | 불필요 |

**레이아웃 구성:**

| 영역 | 컴포넌트 | 설명 |
|:---|:---|:---|
| Header | Logo + NavLink | "QR Code Board" 로고 + "게시판" 링크 |
| Hero | HeroTitle | "QR 코드를 스캔하세요" 메인 타이틀 |
| Main | QRScannerArea | 카메라 뷰파인더 영역 (Alpine.js로 상태 관리) |
| Main | ScanButton | "스캔 시작" / "스캔 중지" 토글 버튼 |
| Main | ScanResult | 스캔 결과 텍스트/URL 표시 영역 |
| Footer | Copyright | "© 2026 QR Code Board" |

**인터랙션:**

| 이벤트 | 동작 | 연결 API |
|:---|:---|:---|
| ScanButton 클릭 | Alpine.js 상태 토글 → html5-qrcode 시작/중지 | — (클라이언트 전용) |
| QR 인식 성공 | ScanResult에 결과 표시, URL이면 링크로 변환 | — |
| NavLink "게시판" 클릭 | /board로 이동 | — |

**에러 상태:**
- 카메라 권한 거부 → "카메라 접근 권한이 필요합니다" 알림
- QR 인식 실패 → "QR 코드를 인식할 수 없습니다" 메시지

**빈 상태:**
- 초기 상태 → "QR 코드를 스캔하려면 '스캔 시작' 버튼을 클릭하세요"

**로딩 상태:**
- 카메라 초기화 중 → 스피너 표시

---

### SCR-002: 게시판 목록

| 항목 | 내용 |
|:---|:---|
| Screen-ID | SCR-002 |
| 화면명 | 게시판 목록 |
| 경로 | /board |
| 연결 UC | UC-003 |
| 인증 | 불필요 |

**레이아웃 구성:**

| 영역 | 컴포넌트 | 설명 |
|:---|:---|:---|
| Header | Logo + NavLink | "QR Code Board" + "홈" 링크 |
| Title | PageTitle + NewPostButton | "게시판" + "글쓰기" 버튼 |
| Main | PostTable | 게시글 목록 테이블 (번호, 제목, 작성일) |
| Main | Pagination | 이전/다음 페이지 버튼 |

**인터랙션:**

| 이벤트 | 동작 | 연결 API |
|:---|:---|:---|
| PostTitle 클릭 | /board/:id 상세 이동 | API-005 |
| NewPostButton 클릭 | /board/new 작성 폼 이동 | API-003 |
| Pagination 클릭 | /board?page=N 으로 HTMX 부분 갱신 | API-002 |

**빈 상태:**
- 게시글 0건 → "아직 게시글이 없습니다. 첫 번째 글을 작성해보세요!"

---

### SCR-003: 게시글 작성

| 항목 | 내용 |
|:---|:---|
| Screen-ID | SCR-003 |
| 화면명 | 게시글 작성 |
| 경로 | /board/new |
| 연결 UC | UC-004 |
| 인증 | 불필요 |

**레이아웃 구성:**

| 영역 | 컴포넌트 | 설명 |
|:---|:---|:---|
| Header | Logo + NavLink | "QR Code Board" + "홈", "게시판" 링크 |
| Title | PageTitle | "새 글 작성" |
| Form | TitleInput | 제목 입력 (label + input) |
| Form | ContentTextarea | 내용 입력 (label + textarea) |
| Actions | SaveButton + CancelButton | "저장" (Primary) + "취소" (Secondary) |

**인터랙션:**

| 이벤트 | 동작 | 연결 API |
|:---|:---|:---|
| SaveButton 클릭 | POST /board → 성공 시 목록 리다이렉트 | API-004 |
| CancelButton 클릭 | /board 목록으로 이동 | — |

**에러 상태:**
- 제목 미입력 → 입력 필드 하단 "제목을 입력해주세요" 에러 메시지
- 내용 미입력 → 입력 필드 하단 "내용을 입력해주세요" 에러 메시지

---

### SCR-004: 게시글 상세

| 항목 | 내용 |
|:---|:---|
| Screen-ID | SCR-004 |
| 화면명 | 게시글 상세 |
| 경로 | /board/:id |
| 연결 UC | UC-005 (조회), UC-007 (삭제) |
| 인증 | 불필요 |

**레이아웃 구성:**

| 영역 | 컴포넌트 | 설명 |
|:---|:---|:---|
| Header | Logo + NavLink | 공통 |
| Title | PostTitle | 게시글 제목 (H1) |
| Meta | PostDate | 작성일 · 수정일 |
| Main | PostContent | 게시글 내용 (본문) |
| Actions | EditButton + DeleteButton + ListButton | "수정" + "삭제" + "목록" |

**인터랙션:**

| 이벤트 | 동작 | 연결 API |
|:---|:---|:---|
| EditButton 클릭 | /board/:id/edit 수정 폼 이동 | API-006 |
| DeleteButton 클릭 | confirm 다이얼로그 → POST /board/:id/delete | API-008 |
| ListButton 클릭 | /board 목록 이동 | — |

**에러 상태:**
- 존재하지 않는 게시글 → "게시글을 찾을 수 없습니다" + 목록 링크

---

### SCR-005: 게시글 수정

| 항목 | 내용 |
|:---|:---|
| Screen-ID | SCR-005 |
| 화면명 | 게시글 수정 |
| 경로 | /board/:id/edit |
| 연결 UC | UC-006 |
| 인증 | 불필요 |

**레이아웃 구성:**

| 영역 | 컴포넌트 | 설명 |
|:---|:---|:---|
| Header | Logo + NavLink | 공통 |
| Title | PageTitle | "게시글 수정" |
| Form | TitleInput | 제목 (기존 값 채움) |
| Form | ContentTextarea | 내용 (기존 값 채움) |
| Actions | SaveButton + CancelButton | "저장" + "취소" |

**인터랙션:**

| 이벤트 | 동작 | 연결 API |
|:---|:---|:---|
| SaveButton 클릭 | POST /board/:id/edit → 상세 리다이렉트 | API-007 |
| CancelButton 클릭 | /board/:id 상세 이동 | — |

**에러 상태:**
- SCR-003과 동일한 유효성 검증 에러

---

## 라우팅 가드

| 경로 | 접근 권한 | 가드 |
|:---|:---|:---|
| / | 전체 | 없음 |
| /board | 전체 | 없음 |
| /board/new | 전체 | 없음 |
| /board/:id | 전체 | 존재하지 않는 ID → 404 |
| /board/:id/edit | 전체 | 존재하지 않는 ID → 404 |
| /board/:id/delete | POST만 | 존재하지 않는 ID → 404 |

> 비회원 게시판이므로 인증 가드 불필요. ID 유효성 검증만 수행.

---

## 반응형 디자인

| 디바이스 | 최소 너비 | 레이아웃 변경 |
|:---|:---:|:---|
| Mobile | 0px | 1컬럼, 전체 너비, 카메라 영역 300x300 |
| Tablet | 768px | 컨테이너 720px, 카메라 영역 400x400 |
| Desktop | 1024px | 컨테이너 1024px, 카메라 영역 500x500 |

---

## 접근성

| 항목 | 기준 | 적용 |
|:---|:---|:---|
| 색상 대비 | WCAG AA 4.5:1 | Primary #3730a3: 7.2:1 ✅ |
| 키보드 네비게이션 | Tab 순서 | Nav → Content → Actions 순서 |
| 스크린리더 | aria-label | QR 스캔 영역, 버튼, 폼 필드 |
| 포커스 표시 | outline | 2px solid #6366f1 ring |
| 폼 레이블 | label[for] | 모든 input/textarea |
