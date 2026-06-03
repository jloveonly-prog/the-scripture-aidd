# ADR-002: API 및 라우트 설계

## Status
Accepted

## Date
2026-05-29

## Context
HTMX 기반 서버 렌더링 게시판이므로 전통적 REST API보다는 HTML 반환 라우트가 적합.
HTMX의 hx-get, hx-post로 부분 갱신하며, 폼 전송은 표준 POST.

## Decision

### 페이지 라우트 (HTML 반환)

| Method | Path | 설명 |
|:---|:---|:---|
| GET | / | 홈페이지 (QR 코드 표시) |
| GET | /board | 게시글 목록 (페이지네이션) |
| GET | /board/new | 새 글 작성 폼 |
| POST | /board | 글 작성 처리 |
| GET | /board/:id | 글 상세 |
| GET | /board/:id/edit | 글 수정 폼 |
| POST | /board/:id/edit | 글 수정 처리 |
| POST | /board/:id/delete | 글 삭제 처리 |

### DB 스키마

```sql
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT '익명',
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
```

### 필드 매핑 일관성

| DB (snake_case) | 코드 변수 (camelCase) | 화면 표시 |
|:---|:---|:---|
| id | id | 번호 |
| title | title | 제목 |
| content | content | 내용 |
| author | author | 작성자 |
| created_at | createdAt | 작성일 |
| updated_at | updatedAt | 수정일 |

### 에러 형식

```typescript
// 모든 에러 응답은 동일 형식
interface APIError {
  error: {
    code: string;    // 'VALIDATION_ERROR', 'NOT_FOUND'
    message: string; // 사용자 친화적 메시지
  };
}
```

## Consequences
- HTMX 부분 렌더링으로 SPA 수준 UX 달성
- 표준 폼 POST로 JavaScript 비활성화 시에도 동작
- snake_case(DB) → camelCase(코드) 매핑 일관 유지
