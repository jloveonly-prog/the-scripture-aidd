# PRD: QR 코드 게시판 (qrCodeBoard)

## 1. 목표 (Objective)

QR 코드를 스캔하여 접속할 수 있는 홈페이지 및 게시판 웹 애플리케이션을 구축한다.
- **사용자**: 로컬 네트워크 내 일반 사용자
- **성공 기준**: QR 코드 생성 → 스캔 → 홈페이지 접속 → 게시판 CRUD 가능

## 2. 기술 스택 (Tech Stack)

| 레이어 | 기술 |
|:---|:---|
| 백엔드 | Node.js (Hono) |
| 프론트엔드 | Hono JSX + HTMX + Alpine.js + Tailwind CSS (CDN) |
| DB | SQLite (better-sqlite3) |
| QR 코드 | qrcode 라이브러리 |
| 인프라 | 로컬 PC |

## 3. 명령어 (Commands)

```
Build: (해당 없음 — 서버 직접 실행)
Dev: npm run dev
Test: npm test
```

## 4. 프로젝트 구조 (Project Structure)

```
src/
  index.ts          → 서버 진입점 (Hono 앱 설정, 라우트 등록)
  db.ts             → SQLite DB 초기화 및 헬퍼
  routes/
    home.tsx        → 홈페이지 라우트 (QR 코드 표시)
    board.tsx       → 게시판 CRUD 라우트
  views/
    layout.tsx      → 공통 HTML 레이아웃 (HTMX, Alpine.js, Tailwind CDN)
    home.tsx        → 홈페이지 뷰
    board/
      list.tsx      → 게시글 목록 뷰
      detail.tsx    → 게시글 상세 뷰
      form.tsx      → 게시글 작성/수정 폼
  public/
    style.css       → 커스텀 스타일
docs/
  PRD.md            → 이 문서
  decisions/        → ADR 문서
  task-breakdown.md → 태스크 분해
```

## 5. 코드 스타일 (Code Style)

```typescript
// 함수형 스타일, camelCase 변수명
// Hono JSX 컴포넌트: PascalCase
// DB 칼럼: snake_case
// API 응답: camelCase

// 예시: 게시글 생성
app.post('/api/posts', async (c) => {
  const body = await c.req.parseBody();
  const title = String(body.title).trim();
  if (!title) {
    return c.json({ error: { code: 'VALIDATION_ERROR', message: '제목을 입력해주세요' } }, 422);
  }
  const result = db.prepare('INSERT INTO posts (title, content) VALUES (?, ?)').run(title, content);
  return c.redirect('/board');
});
```

## 6. 테스트 전략 (Testing Strategy)

- **프레임워크**: Node.js 내장 test runner (`node --test`)
- **테스트 위치**: `tests/` 디렉토리
- **커버리지**: DB CRUD 80%, API 엔드포인트 15%, 수동 E2E 5%
- **테스트 수준**:
  - Unit: DB 헬퍼 함수, 유효성 검증
  - Integration: API 라우트 요청/응답
  - E2E: `npm run dev` 후 브라우저 수동 검증

## 7. 경계 (Boundaries)

### Always Do
- 모든 사용자 입력을 서버에서 검증
- SQL 파라미터 바인딩 사용 (SQL Injection 방지)
- HTML 출력 시 XSS 방지 (Hono JSX 자동 이스케이프)
- 테스트 실행 후 커밋

### Ask First
- DB 스키마 변경
- 새 의존성 추가
- 포트 변경

### Never Do
- 시크릿을 코드에 하드코딩
- `eval()` 사용
- 사용자 입력을 SQL에 직접 결합
- 에러 스택 트레이스를 사용자에게 노출

## 8. 성공 기준 (Success Criteria)

- [ ] `npm run dev`로 서버 시작 가능
- [ ] 홈페이지에서 현재 서버 URL의 QR 코드 표시
- [ ] 게시판 글 목록 조회 (GET /board)
- [ ] 게시글 작성 (POST /board)
- [ ] 게시글 상세 조회 (GET /board/:id)
- [ ] 게시글 수정 (GET /board/:id/edit, POST /board/:id/edit)
- [ ] 게시글 삭제 (POST /board/:id/delete)
- [ ] 페이지네이션 지원
- [ ] 반응형 디자인 (모바일/데스크톱)
- [ ] HTMX로 부분 렌더링
- [ ] 포트 3000 사용
