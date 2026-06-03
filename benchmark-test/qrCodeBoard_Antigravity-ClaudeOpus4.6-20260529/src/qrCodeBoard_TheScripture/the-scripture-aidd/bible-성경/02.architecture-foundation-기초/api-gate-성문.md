# 🚪 API 명세서 — QR Code 게시판 홈페이지

> *"And he measured the gate ... and the threshold of the gate."* — Ezekiel 40:6 (KJV)

---

## 공통 규약

| 항목 | 규격 |
|:---|:---|
| Base URL | `http://localhost:4000` |
| 인증 방식 | 불필요 (공개 게시판) |
| 콘텐츠 타입 | text/html (SSR) + application/x-www-form-urlencoded (폼 제출) |
| 렌더링 방식 | Hono JSX SSR (서버 사이드 렌더링) |

> 이 프로젝트는 REST API가 아닌 SSR 기반 폼 제출 방식이다.
> HTMX를 통한 부분 갱신을 사용하되, 기본 흐름은 HTML 폼 전송이다.

---

## API 전체 목록

| API-ID | Method | Endpoint | 설명 | 연결 REQ | 인증 |
|:---|:---|:---|:---|:---|:---:|
| API-001 | GET | / | 홈페이지 | REQ-001, FR-001 | ❌ |
| API-002 | GET | /board | 게시판 글 목록 | REQ-002, FR-002 | ❌ |
| API-003 | GET | /board/:id | 게시판 글 상세 | REQ-002, FR-003 | ❌ |
| API-004 | GET | /board/new | 게시판 글 작성 폼 | REQ-002, FR-004 | ❌ |
| API-005 | POST | /board | 게시판 글 저장 | REQ-002, FR-004 | ❌ |
| API-006 | GET | /board/:id/edit | 게시판 글 수정 폼 | REQ-002, FR-005 | ❌ |
| API-007 | POST | /board/:id/edit | 게시판 글 수정 처리 | REQ-002, FR-005 | ❌ |
| API-008 | POST | /board/:id/delete | 게시판 글 삭제 처리 | REQ-002, FR-006 | ❌ |

---

## API 상세 명세

### API-001: 홈페이지

| 항목 | 내용 |
|:---|:---|
| API-ID | API-001 |
| Method | GET |
| Endpoint | / |
| 설명 | QR 코드 스캔 시 접속되는 메인 홈페이지 |
| 연결 REQ | REQ-001, FR-001 |
| 연결 UC | UC-001 |
| 인증 필요 | ❌ |
| 연결 TBL | — |

**요청(Request):** 파라미터 없음

**응답 — 성공 (200):** HTML 페이지 (홈페이지 UI)

---

### API-002: 게시판 글 목록

| 항목 | 내용 |
|:---|:---|
| API-ID | API-002 |
| Method | GET |
| Endpoint | /board |
| 설명 | 게시판 글 목록 조회 |
| 연결 REQ | REQ-002, FR-002 |
| 연결 UC | UC-002 |
| 인증 필요 | ❌ |
| 연결 TBL | TBL-001 (posts) |

**요청(Request):** 파라미터 없음

**응답 — 성공 (200):** HTML 페이지 (게시글 목록 — 번호, 제목, 작성일)

---

### API-003: 게시판 글 상세

| 항목 | 내용 |
|:---|:---|
| API-ID | API-003 |
| Method | GET |
| Endpoint | /board/:id |
| 설명 | 게시판 글 상세 보기 |
| 연결 REQ | REQ-002, FR-003 |
| 연결 UC | UC-003 |
| 인증 필요 | ❌ |
| 연결 TBL | TBL-001 (posts) |

**요청(Request):**
| 파라미터 | 타입 | 필수 | 설명 | 검증 규칙 |
|:---|:---|:---:|:---|:---|
| id | Integer (Path) | ✅ | 게시글 ID | 양수 정수 |

**응답 — 성공 (200):** HTML 페이지 (게시글 상세 — 제목, 내용, 작성일, 수정/삭제 버튼)

**응답 — 실패:**
| 에러 코드 | HTTP | 설명 |
|:---|:---:|:---|
| POST_NOT_FOUND | 404 | 존재하지 않는 게시글 |

---

### API-004: 게시판 글 작성 폼

| 항목 | 내용 |
|:---|:---|
| API-ID | API-004 |
| Method | GET |
| Endpoint | /board/new |
| 설명 | 새 글 작성 폼 표시 |
| 연결 REQ | REQ-002, FR-004 |
| 연결 UC | UC-004 |
| 인증 필요 | ❌ |
| 연결 TBL | — |

**요청(Request):** 파라미터 없음

**응답 — 성공 (200):** HTML 페이지 (글 작성 폼 — 제목, 내용 입력)

---

### API-005: 게시판 글 저장

| 항목 | 내용 |
|:---|:---|
| API-ID | API-005 |
| Method | POST |
| Endpoint | /board |
| 설명 | 새 게시글 저장 |
| 연결 REQ | REQ-002, FR-004 |
| 연결 UC | UC-004 |
| 인증 필요 | ❌ |
| 연결 TBL | TBL-001 (posts) |

**요청(Request):**
| 파라미터 | 타입 | 필수 | 설명 | 검증 규칙 |
|:---|:---|:---:|:---|:---|
| title | String (Body) | ✅ | 게시글 제목 | trim 후 1자 이상 |
| content | String (Body) | ✅ | 게시글 내용 | trim 후 1자 이상 |

**응답 — 성공 (302):** `/board` 로 리다이렉트

**응답 — 실패:**
| 에러 코드 | HTTP | 설명 |
|:---|:---:|:---|
| EMPTY_TITLE | 400 | 제목이 비어있음 |
| EMPTY_CONTENT | 400 | 내용이 비어있음 |

---

### API-006: 게시판 글 수정 폼

| 항목 | 내용 |
|:---|:---|
| API-ID | API-006 |
| Method | GET |
| Endpoint | /board/:id/edit |
| 설명 | 게시글 수정 폼 표시 (기존 데이터 채움) |
| 연결 REQ | REQ-002, FR-005 |
| 연결 UC | UC-005 |
| 인증 필요 | ❌ |
| 연결 TBL | TBL-001 (posts) |

**요청(Request):**
| 파라미터 | 타입 | 필수 | 설명 | 검증 규칙 |
|:---|:---|:---:|:---|:---|
| id | Integer (Path) | ✅ | 게시글 ID | 양수 정수 |

**응답 — 성공 (200):** HTML 페이지 (수정 폼 — 기존 제목/내용 채움)

**응답 — 실패:**
| 에러 코드 | HTTP | 설명 |
|:---|:---:|:---|
| POST_NOT_FOUND | 404 | 존재하지 않는 게시글 |

---

### API-007: 게시판 글 수정 처리

| 항목 | 내용 |
|:---|:---|
| API-ID | API-007 |
| Method | POST |
| Endpoint | /board/:id/edit |
| 설명 | 게시글 수정 저장 |
| 연결 REQ | REQ-002, FR-005 |
| 연결 UC | UC-005 |
| 인증 필요 | ❌ |
| 연결 TBL | TBL-001 (posts) |

**요청(Request):**
| 파라미터 | 타입 | 필수 | 설명 | 검증 규칙 |
|:---|:---|:---:|:---|:---|
| id | Integer (Path) | ✅ | 게시글 ID | 양수 정수 |
| title | String (Body) | ✅ | 수정된 제목 | trim 후 1자 이상 |
| content | String (Body) | ✅ | 수정된 내용 | trim 후 1자 이상 |

**응답 — 성공 (302):** `/board/:id` 로 리다이렉트

**응답 — 실패:**
| 에러 코드 | HTTP | 설명 |
|:---|:---:|:---|
| POST_NOT_FOUND | 404 | 존재하지 않는 게시글 |
| EMPTY_TITLE | 400 | 제목이 비어있음 |
| EMPTY_CONTENT | 400 | 내용이 비어있음 |

---

### API-008: 게시판 글 삭제 처리

| 항목 | 내용 |
|:---|:---|
| API-ID | API-008 |
| Method | POST |
| Endpoint | /board/:id/delete |
| 설명 | 게시글 삭제 |
| 연결 REQ | REQ-002, FR-006 |
| 연결 UC | UC-006 |
| 인증 필요 | ❌ |
| 연결 TBL | TBL-001 (posts) |

**요청(Request):**
| 파라미터 | 타입 | 필수 | 설명 | 검증 규칙 |
|:---|:---|:---:|:---|:---|
| id | Integer (Path) | ✅ | 게시글 ID | 양수 정수 |

**응답 — 성공 (302):** `/board` 로 리다이렉트

**응답 — 실패:**
| 에러 코드 | HTTP | 설명 |
|:---|:---:|:---|
| POST_NOT_FOUND | 404 | 존재하지 않는 게시글 |

---

## 에러 코드 정의

| 에러 코드 | HTTP 상태코드 | 설명 |
|:---|:---:|:---|
| POST_NOT_FOUND | 404 | 요청한 게시글이 존재하지 않음 |
| EMPTY_TITLE | 400 | 제목이 비어있거나 공백만 있음 |
| EMPTY_CONTENT | 400 | 내용이 비어있거나 공백만 있음 |
| INTERNAL_ERROR | 500 | 서버 내부 오류 |

---

## 인증/인가 규격

> 본 프로젝트는 공개 게시판으로 인증/인가가 불필요하다.
> 모든 API는 인증 없이 접근 가능하다. (req.md에 인증 관련 요구사항 없음)
