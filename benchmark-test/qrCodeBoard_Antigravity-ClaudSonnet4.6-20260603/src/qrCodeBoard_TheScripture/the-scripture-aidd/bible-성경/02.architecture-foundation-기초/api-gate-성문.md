# 🚪 API 명세서 (성문) — QR코드 게시판 (The Scripture)

> **bible-성경/02.architecture-foundation-기초/api-gate-성문.md**

---

## 1. API 전체 목록

| API-ID | Method | Endpoint | 설명 | 연결 REQ | 인증 |
|:---|:---|:---|:---|:---|:---:|
| API-001 | GET | / | 홈페이지 (QR 스캐너 화면) | REQ-003, FR-003 | ❌ |
| API-002 | GET | /board | 게시판 글 목록 | REQ-004, FR-004 | ❌ |
| API-003 | GET | /board/new | 게시글 작성 폼 | REQ-005, FR-005 | ❌ |
| API-004 | POST | /board | 게시글 저장 | REQ-005, FR-005 | ❌ |
| API-005 | GET | /board/:id | 게시글 상세 조회 | REQ-006, FR-006 | ❌ |

---

## 2. 공통 규약

| 항목 | 내용 |
|:---|:---|
| Base URL | `http://localhost:4000` |
| 인증 | 없음 (v1.0 - req.md에 인증 없음) |
| 콘텐츠 타입 | HTML (SSR, Hono JSX 렌더링) |
| 폼 전송 | `application/x-www-form-urlencoded` |
| 에러 처리 | HTML 페이지 렌더링 (에러 메시지 포함) |
| 리다이렉트 | 게시글 저장 후 → 302 `/board` |

---

## 3. API 상세 명세

### API-001: 홈페이지 (QR 스캐너)

| 항목 | 내용 |
|:---|:---|
| API-ID | API-001 |
| Method | GET |
| Endpoint | / |
| 설명 | QR 스캐너가 있는 홈페이지 메인 화면 반환 |
| 연결 REQ | REQ-003, FR-003 |
| 연결 UC | UC-001 |
| 인증 필요 | ❌ |
| 연결 TBL | 없음 |
| 연결 ARCH | ARCH-001, ARCH-003 |

**요청(Request):**
| 파라미터 | 타입 | 필수 | 설명 | 검증 규칙 |
|:---|:---|:---:|:---|:---|
| — | — | — | 쿼리 파라미터 없음 | — |

**응답(Response) — 성공 (200):**
```
Content-Type: text/html
Body: 홈페이지 HTML (QR 스캐너 UI 포함)
```

**비즈니스 에러:**
| 에러 | HTTP | 설명 |
|:---|:---:|:---|
| SERVER_ERROR | 500 | 서버 내부 오류 |

---

### API-002: 게시판 글 목록

| 항목 | 내용 |
|:---|:---|
| API-ID | API-002 |
| Method | GET |
| Endpoint | /board |
| 설명 | 게시판 글 목록을 최신순으로 반환 |
| 연결 REQ | REQ-004, FR-004 |
| 연결 UC | UC-003 |
| 인증 필요 | ❌ |
| 연결 TBL | TBL-001 (posts) |
| 연결 ARCH | ARCH-002, ARCH-004 |

**요청(Request):**
| 파라미터 | 타입 | 필수 | 설명 | 검증 규칙 |
|:---|:---|:---:|:---|:---|
| — | — | — | 쿼리 파라미터 없음 | — |

**DB 쿼리:**
```sql
SELECT id, title, created_at FROM posts ORDER BY created_at DESC
```

**응답(Response) — 성공 (200):**
```
Content-Type: text/html
Body: 게시판 목록 HTML (제목, 작성일 포함)
```

**응답 — 빈 목록:**
```
200 OK — "등록된 게시글이 없습니다" 메시지 포함
```

**비즈니스 에러:**
| 에러 | HTTP | 설명 |
|:---|:---:|:---|
| DB_ERROR | 500 | DB 조회 실패 |

---

### API-003: 게시글 작성 폼

| 항목 | 내용 |
|:---|:---|
| API-ID | API-003 |
| Method | GET |
| Endpoint | /board/new |
| 설명 | 게시글 작성 폼 HTML 반환 |
| 연결 REQ | REQ-005, FR-005 |
| 연결 UC | UC-005 |
| 인증 필요 | ❌ |
| 연결 TBL | 없음 |
| 연결 ARCH | ARCH-002 |

**요청(Request):** 없음

**응답(Response) — 성공 (200):**
```
Content-Type: text/html
Body: 게시글 작성 폼 HTML (제목, 내용 입력 필드)
```

---

### API-004: 게시글 저장

| 항목 | 내용 |
|:---|:---|
| API-ID | API-004 |
| Method | POST |
| Endpoint | /board |
| 설명 | 게시글 데이터를 받아 DB에 저장 후 목록으로 리다이렉트 |
| 연결 REQ | REQ-005, FR-005 |
| 연결 UC | UC-005 |
| 인증 필요 | ❌ |
| 연결 TBL | TBL-001 (posts) |
| 연결 ARCH | ARCH-002, ARCH-004 |

**요청(Request):**
| 파라미터 | 타입 | 필수 | 설명 | 검증 규칙 |
|:---|:---|:---:|:---|:---|
| title | String | ✅ | 게시글 제목 | trim 후 빈값 불가, 최대 200자 |
| content | String | ✅ | 게시글 내용 | trim 후 빈값 불가 |

**서버 검증 로직:**
```typescript
// 방어 깊이 2번째 층 (서버)
const title = body.title?.trim()
const content = body.content?.trim()
if (!title || !content) {
  return c.html(<Form error="제목과 내용을 입력해주세요" />, 400)
}
```

**DB 쿼리:**
```sql
INSERT INTO posts (title, content) VALUES (?, ?)
```

**응답(Response) — 성공 (302):**
```
Location: /board
```

**응답 — 실패 (400):**
```
Content-Type: text/html
Body: 작성 폼 HTML (에러 메시지 포함)
```

**비즈니스 에러:**
| 에러 | HTTP | 설명 |
|:---|:---:|:---|
| INVALID_INPUT | 400 | 제목 또는 내용 빈값 |
| DB_ERROR | 500 | DB 저장 실패 |

---

### API-005: 게시글 상세 조회

| 항목 | 내용 |
|:---|:---|
| API-ID | API-005 |
| Method | GET |
| Endpoint | /board/:id |
| 설명 | 특정 게시글의 상세 내용 반환 |
| 연결 REQ | REQ-006, FR-006 |
| 연결 UC | UC-004 |
| 인증 필요 | ❌ |
| 연결 TBL | TBL-001 (posts) |
| 연결 ARCH | ARCH-002, ARCH-004 |

**요청(Request):**
| 파라미터 | 타입 | 필수 | 설명 | 검증 규칙 |
|:---|:---|:---:|:---|:---|
| id | Integer (Path) | ✅ | 게시글 ID | 양의 정수 |

**DB 쿼리:**
```sql
SELECT id, title, content, created_at FROM posts WHERE id = ?
```

**응답(Response) — 성공 (200):**
```
Content-Type: text/html
Body: 게시글 상세 HTML (제목, 내용, 작성일)
```

**응답 — 실패 (404):**
```
Content-Type: text/html
Body: "게시글을 찾을 수 없습니다" 메시지 + 목록으로 이동 링크
```

**비즈니스 에러:**
| 에러 | HTTP | 설명 |
|:---|:---:|:---|
| POST_NOT_FOUND | 404 | 존재하지 않는 게시글 ID |
| DB_ERROR | 500 | DB 조회 실패 |

---

## 4. 에러 코드 정의

| 에러 코드 | HTTP | 설명 | 발생 API |
|:---|:---:|:---|:---|
| SERVER_ERROR | 500 | 서버 내부 오류 | 전체 |
| DB_ERROR | 500 | DB 연결/쿼리 오류 | API-002, API-004, API-005 |
| INVALID_INPUT | 400 | 입력값 유효성 실패 | API-004 |
| POST_NOT_FOUND | 404 | 게시글 없음 | API-005 |

---

## 5. 인증/인가 규격

> req.md에 인증/로그인 요구사항 없음 → v1.0 인증 없음
> 모든 API는 인증 없이 접근 가능 (공개 게시판)

---

## 정경화 조건 확인

- [x] 모든 API에 요청/응답 상세 정의 완료
- [x] 공통 규약 작성 완료
- [x] 모든 API에 연결 REQ, UC, TBL 기재
- [x] 에러 코드 정의 완료
- [x] 인증 없음 명시 완료 (req.md 근거)
- [x] RTM 갱신 대상 API-ID 전체 확인
