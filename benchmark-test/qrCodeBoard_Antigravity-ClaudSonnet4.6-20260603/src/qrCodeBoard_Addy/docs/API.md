# API 설계 — QR Code Board

## 기본 원칙
- Contract-First: 타입 먼저 정의
- 에러 응답 통일: `{ error: { code, message } }`
- 입력 검증: API 경계에서만
- 페이지네이션: 목록 조회 시 기본 제공

## 데이터 모델

### Post (게시물)

| 컬럼 | 타입 | 설명 |
|:---|:---|:---|
| id | INTEGER PK | 자동 증가 |
| content | TEXT NOT NULL | QR 스캔 결과 (URL or 텍스트) |
| type | TEXT | 'url' \| 'text' |
| created_at | TEXT | ISO 8601 타임스탬프 |

### API 응답 타입 (camelCase)

```typescript
interface Post {
  id: number;
  content: string;
  type: 'url' | 'text';
  createdAt: string;
}

interface APIError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
```

## 엔드포인트

### GET /
홈 페이지 — QR 스캐너 UI

### GET /board
게시판 페이지 — 목록 조회 UI

### POST /api/posts
QR 스캔 결과 저장

**Request:**
```json
{ "content": "https://example.com" }
```

**Response 201:**
```json
{
  "id": 1,
  "content": "https://example.com",
  "type": "url",
  "createdAt": "2026-06-03T10:00:00.000Z"
}
```

**Response 422:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "content is required"
  }
}
```

### GET /api/posts
게시물 목록 조회

**Query params:**
- `page` (기본값: 1)
- `pageSize` (기본값: 20)

**Response 200:**
```json
{
  "data": [...],
  "pagination": { "page": 1, "pageSize": 20, "totalItems": 5, "totalPages": 1 }
}
```

### DELETE /api/posts/:id
게시물 삭제

**Response 204:** (No Content)

**Response 404:**
```json
{
  "error": { "code": "NOT_FOUND", "message": "Post not found" }
}
```

### GET /api/posts/:id/qr
(옵션) 특정 게시물 QR 코드 이미지 반환 — 구현 범위 밖

## 에러 코드 목록

| HTTP | code | 상황 |
|:---|:---|:---|
| 400 | BAD_REQUEST | 잘못된 요청 형식 |
| 404 | NOT_FOUND | 리소스 없음 |
| 422 | VALIDATION_ERROR | 입력값 유효성 오류 |
| 500 | INTERNAL_ERROR | 서버 내부 오류 |

## HTTP 상태 코드 매핑

- 200: 정상 조회
- 201: 생성 성공
- 204: 삭제 성공 (본문 없음)
- 400: 잘못된 요청
- 404: 리소스 없음
- 422: 유효성 검증 실패
- 500: 서버 오류
