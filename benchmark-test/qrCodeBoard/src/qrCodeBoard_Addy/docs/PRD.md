# Spec: QR Code Board (QR 게시판)

## Objective

구글 QR 코드를 스캔하여 화면에 결과를 띄우는 홈페이지와 게시판을 제공하는 웹 애플리케이션.

**사용자:** 로컬 PC에서 실행하는 개인 사용자  
**성공 기준:**
- QR 코드 스캔(카메라) 또는 이미지 업로드로 URL을 추출하여 화면에 표시
- 게시판 CRUD(목록, 작성, 상세, 수정, 삭제) 동작
- `npm run dev` 실행 시 정상 작동

## Tech Stack

| 레이어 | 기술 |
|---|---|
| 백엔드 | Node.js (Hono) |
| 프론트 | Hono JSX + HTMX + Alpine.js + Tailwind CSS |
| DB | SQLite (better-sqlite3) |
| 인프라 | 로컬 PC |

## Commands

```bash
Dev:   npm run dev
Build: npm run build
Test:  npm test
```

## Project Structure

```
src/
  index.ts          → Hono 앱 엔트리포인트
  db.ts             → SQLite 연결 및 초기화
  routes/
    home.tsx        → 홈페이지 (QR 스캔)
    board.tsx       → 게시판 라우트
  views/
    layout.tsx      → 공통 레이아웃
    home.tsx        → 홈페이지 뷰
    board/
      list.tsx      → 게시글 목록
      form.tsx      → 작성/수정 폼
      detail.tsx    → 게시글 상세
  public/
    style.css       → 추가 스타일
    js/
      qr-scanner.js → QR 스캔 클라이언트 로직
docs/
  PRD.md
  tasks.md
```

## Code Style

```typescript
// Hono JSX 예시
import { Hono } from 'hono'
import { jsx } from 'hono/jsx'

const app = new Hono()

app.get('/', (c) => {
  return c.html(<HomePage />)
})
```

- TypeScript 사용
- 함수형 컴포넌트 스타일
- snake_case for DB columns, camelCase for TS variables

## Testing Strategy

- Hono 내장 테스트 유틸 또는 vitest 사용
- 핵심 API 엔드포인트 통합 테스트
- 수동 브라우저 테스트로 QR 스캔 확인

## Boundaries

- **Always:** 입력값 검증, SQL 파라미터화 쿼리 사용
- **Ask first:** 외부 라이브러리 추가
- **Never:** 비밀키/시크릿 코드에 하드코딩

## Success Criteria

- [ ] 홈페이지: 카메라로 QR 코드 스캔 → URL 화면 표시
- [ ] 게시판 목록: GET /board → 글 목록 표시
- [ ] 게시판 작성: POST /board → 새 글 저장
- [ ] 게시판 상세: GET /board/:id → 글 내용 표시
- [ ] 게시판 수정: PUT /board/:id → 글 수정
- [ ] 게시판 삭제: DELETE /board/:id → 글 삭제
- [ ] QR 코드: 스캔된 URL을 화면에 표시 및 링크 제공
- [ ] `npm run dev` 정상 실행

## Open Questions

없음 — req.md 요구사항이 명확함.
