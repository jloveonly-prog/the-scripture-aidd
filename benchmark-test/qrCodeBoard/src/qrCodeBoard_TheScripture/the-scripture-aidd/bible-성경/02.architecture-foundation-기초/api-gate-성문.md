# 🚪 API 명세서 — QR코드 게시판

> *"And he measured the gate ... and the threshold of the gate."* — Ezekiel 40:6 (KJV)

---

## 공통 규약

| 항목 | 규격 |
|:---|:---|
| Base URL | `http://localhost:3001` |
| 콘텐츠 타입 | text/html (HTMX SSR 기반) |
| 인증 방식 | 불필요 (비회원 게시판) |
| 에러 형식 | HTML 에러 페이지 |

> 본 시스템은 HTMX + Hono JSX SSR 구조이므로 JSON API가 아닌 **HTML 응답** 기반이다.
> 페이지 라우트는 전체 HTML을, HTMX 부분 요청은 HTML fragment를 반환한다.

---

## API 전체 목록

| API-ID | Method | Endpoint | 설명 | 연결 REQ | 인증 |
|:---|:---|:---|:---|:---|:---:|
| API-001 | GET | / | 홈페이지 (QR 스캔 포함) | REQ-001, REQ-002, FR-001, FR-002, FR-003 | ❌ |
| API-002 | GET | /board | 게시판 목록 | REQ-003, FR-004 | ❌ |
| API-003 | GET | /board/new | 게시글 작성 폼 | REQ-003, FR-005 | ❌ |
| API-004 | POST | /board | 게시글 저장 | REQ-003, FR-005 | ❌ |
| API-005 | GET | /board/:id | 게시글 상세 | REQ-003, FR-006 | ❌ |
| API-006 | GET | /board/:id/edit | 게시글 수정 폼 | REQ-003, FR-007 | ❌ |
| API-007 | POST | /board/:id/edit | 게시글 수정 저장 | REQ-003, FR-007 | ❌ |
| API-008 | POST | /board/:id/delete | 게시글 삭제 | REQ-003, FR-008 | ❌ |

---

## API 상세 명세

### API-001: 홈페이지

| 항목 | 내용 |
|:---|:---|
| API-ID | API-001 |
| Method | GET |
| Endpoint | / |
| 설명 | QR 코드 스캔 기능이 포함된 메인 홈페이지 |
| 연결 REQ | REQ-001, REQ-002, FR-001, FR-002, FR-003 |
| 연결 UC | UC-001, UC-002 |
| 인증 필요 | ❌ |
| 연결 TBL | — (QR 스캔은 클라이언트 전용) |

**요청(Request):**
| 파라미터 | 타입 | 필수 | 설명 | 검증 규칙 |
|:---|:---|:---:|:---|:---|
| — | — | — | 파라미터 없음 | — |

**응답 — 성공 (200):**
- Content-Type: text/html
- QR 스캔 영역 + 게시판 네비게이션이 포함된 전체 HTML 페이지

**응답 — 실패:** 없음 (정적 페이지)

---

### API-002: 게시판 목록

| 항목 | 내용 |
|:---|:---|
| API-ID | API-002 |
| Method | GET |
| Endpoint | /board |
| 설명 | 게시글 목록 표시 |
| 연결 REQ | REQ-003, FR-004 |
| 연결 UC | UC-003 |
| 인증 필요 | ❌ |
| 연결 TBL | TBL-001 (posts) |

**요청(Request):**
| 파라미터 | 타입 | 필수 | 설명 | 검증 규칙 |
|:---|:---|:---:|:---|:---|
| page | Integer (Query) | ⬜ | 페이지 번호 | 기본값 1, 최소 1 |

**응답 — 성공 (200):**
- Content-Type: text/html
- 게시글 목록(번호, 제목, 작성일) + 페이지네이션 HTML

**응답 — 실패:**
| 에러 | HTTP | 설명 |
|:---|:---:|:---|
| DB 조회 실패 | 500 | 서버 에러 페이지 |

---

### API-003: 게시글 작성 폼

| 항목 | 내용 |
|:---|:---|
| API-ID | API-003 |
| Method | GET |
| Endpoint | /board/new |
| 설명 | 게시글 작성 폼 표시 |
| 연결 REQ | REQ-003, FR-005 |
| 연결 UC | UC-004 |
| 인증 필요 | ❌ |
| 연결 TBL | — |

**요청:** 파라미터 없음
**응답 — 성공 (200):** 제목, 내용 입력 폼 HTML

---

### API-004: 게시글 저장

| 항목 | 내용 |
|:---|:---|
| API-ID | API-004 |
| Method | POST |
| Endpoint | /board |
| 설명 | 새 게시글 DB 저장 |
| 연결 REQ | REQ-003, FR-005 |
| 연결 UC | UC-004 |
| 인증 필요 | ❌ |
| 연결 TBL | TBL-001 (posts) |

**요청(Request):**
| 파라미터 | 타입 | 필수 | 설명 | 검증 규칙 |
|:---|:---|:---:|:---|:---|
| title | String (Body) | ✅ | 게시글 제목 | 최소 1자, 최대 200자 |
| content | String (Body) | ✅ | 게시글 내용 | 최소 1자 |

**응답 — 성공 (302):**
- Redirect: /board (목록 페이지로 이동)

**응답 — 실패:**
| 에러 | HTTP | 설명 |
|:---|:---:|:---|
| EMPTY_TITLE | 400 | 제목이 비어있음 → 작성 폼 재표시 + 에러 메시지 |
| EMPTY_CONTENT | 400 | 내용이 비어있음 → 작성 폼 재표시 + 에러 메시지 |

---

### API-005: 게시글 상세

| 항목 | 내용 |
|:---|:---|
| API-ID | API-005 |
| Method | GET |
| Endpoint | /board/:id |
| 설명 | 게시글 상세 표시 |
| 연결 REQ | REQ-003, FR-006 |
| 연결 UC | UC-005 |
| 인증 필요 | ❌ |
| 연결 TBL | TBL-001 (posts) |

**요청(Request):**
| 파라미터 | 타입 | 필수 | 설명 | 검증 규칙 |
|:---|:---|:---:|:---|:---|
| id | Integer (Path) | ✅ | 게시글 ID | 유효한 정수 |

**응답 — 성공 (200):** 게시글 상세(제목, 내용, 작성일, 수정일) HTML

**응답 — 실패:**
| 에러 | HTTP | 설명 |
|:---|:---:|:---|
| POST_NOT_FOUND | 404 | 게시글 없음 → "게시글을 찾을 수 없습니다" |

---

### API-006: 게시글 수정 폼

| 항목 | 내용 |
|:---|:---|
| API-ID | API-006 |
| Method | GET |
| Endpoint | /board/:id/edit |
| 설명 | 기존 값이 채워진 수정 폼 표시 |
| 연결 REQ | REQ-003, FR-007 |
| 연결 UC | UC-006 |
| 인증 필요 | ❌ |
| 연결 TBL | TBL-001 (posts) |

**요청:** id (Path) — 게시글 ID
**응답 — 성공 (200):** 기존 값이 채워진 수정 폼 HTML
**응답 — 실패:** POST_NOT_FOUND (404)

---

### API-007: 게시글 수정 저장

| 항목 | 내용 |
|:---|:---|
| API-ID | API-007 |
| Method | POST |
| Endpoint | /board/:id/edit |
| 설명 | 수정된 게시글 DB 갱신 |
| 연결 REQ | REQ-003, FR-007 |
| 연결 UC | UC-006 |
| 인증 필요 | ❌ |
| 연결 TBL | TBL-001 (posts) |

**요청(Request):**
| 파라미터 | 타입 | 필수 | 설명 | 검증 규칙 |
|:---|:---|:---:|:---|:---|
| title | String (Body) | ✅ | 수정 제목 | 최소 1자, 최대 200자 |
| content | String (Body) | ✅ | 수정 내용 | 최소 1자 |

**응답 — 성공 (302):** Redirect: /board/:id (상세 페이지)
**응답 — 실패:** EMPTY_TITLE (400), POST_NOT_FOUND (404)

---

### API-008: 게시글 삭제

| 항목 | 내용 |
|:---|:---|
| API-ID | API-008 |
| Method | POST |
| Endpoint | /board/:id/delete |
| 설명 | 게시글 DB 삭제 |
| 연결 REQ | REQ-003, FR-008 |
| 연결 UC | UC-007 |
| 인증 필요 | ❌ |
| 연결 TBL | TBL-001 (posts) |

**요청:** id (Path) — 게시글 ID
**응답 — 성공 (302):** Redirect: /board (목록)
**응답 — 실패:** POST_NOT_FOUND (404)

---

## 에러 코드 정의

| 에러 코드 | HTTP | 설명 |
|:---|:---:|:---|
| POST_NOT_FOUND | 404 | 존재하지 않는 게시글 |
| EMPTY_TITLE | 400 | 제목 미입력 |
| EMPTY_CONTENT | 400 | 내용 미입력 |
| SERVER_ERROR | 500 | 서버 내부 오류 |

---

## 인증/인가 규격

본 시스템은 비회원 게시판이므로 인증/인가가 불필요하다.
모든 API는 인증 없이 접근 가능하다.
