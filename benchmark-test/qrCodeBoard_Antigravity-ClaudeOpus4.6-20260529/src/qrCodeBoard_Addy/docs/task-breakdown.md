# 구현 태스크 분해: QR 코드 게시판

## Overview
QR 코드로 접속 가능한 홈페이지 및 게시판 구현. 수직 슬라이스 방식으로 분해.

## Architecture Decisions
- ADR-001: Hono + SQLite + HTMX 기술 스택
- ADR-002: HTML 반환 라우트 + HTMX 부분 렌더링

## Task List

### Phase 1: Foundation (기반)

- [ ] Task 1: 프로젝트 설정 및 서버 기동
  - Acceptance: `npm run dev`로 3000번 포트에서 Hono 서버 시작
  - Verify: `curl http://localhost:3000` 응답 확인
  - Files: `src/index.ts`, `package.json`
  - Scope: Small

- [ ] Task 2: DB 초기화 및 스키마 생성
  - Acceptance: posts 테이블 생성, CRUD 헬퍼 함수 동작
  - Verify: 테스트 코드로 INSERT/SELECT 확인
  - Files: `src/db.ts`
  - Scope: Small

- [ ] Task 3: 공통 레이아웃 뷰 작성
  - Acceptance: HTML 문서 구조 + Tailwind CDN + HTMX + Alpine.js 로드
  - Verify: 브라우저에서 레이아웃 렌더링 확인
  - Files: `src/views/layout.tsx`
  - Scope: Small

### Checkpoint: Foundation
- [ ] 서버 시작 가능
- [ ] DB 테이블 생성 확인
- [ ] 레이아웃 렌더링 확인

### Phase 2: Core Features (핵심 기능)

- [ ] Task 4: 홈페이지 + QR 코드 표시
  - Acceptance: 홈페이지에 서버 URL QR 코드 SVG 표시
  - Verify: GET / 접속 시 QR 코드 화면 표시
  - Files: `src/routes/home.tsx`, `src/views/home.tsx`
  - Scope: Small

- [ ] Task 5: 게시글 목록 조회
  - Acceptance: GET /board에서 게시글 목록 표시, 페이지네이션
  - Verify: 게시글 존재 시 목록 표시, 없을 시 빈 상태 표시
  - Files: `src/routes/board.tsx`, `src/views/board/list.tsx`
  - Scope: Medium

- [ ] Task 6: 게시글 작성
  - Acceptance: GET /board/new 폼 표시, POST /board 저장 후 리다이렉트
  - Verify: 폼 작성 → 저장 → 목록에서 확인
  - Files: `src/routes/board.tsx`, `src/views/board/form.tsx`
  - Scope: Small

- [ ] Task 7: 게시글 상세 조회
  - Acceptance: GET /board/:id에서 게시글 제목, 내용, 작성자, 작성일 표시
  - Verify: 목록에서 클릭 → 상세 페이지 표시
  - Files: `src/routes/board.tsx`, `src/views/board/detail.tsx`
  - Scope: Small

- [ ] Task 8: 게시글 수정
  - Acceptance: GET /board/:id/edit 수정 폼, POST /board/:id/edit 업데이트
  - Verify: 수정 폼 → 수정 → 상세에서 변경 확인
  - Files: `src/routes/board.tsx`, `src/views/board/form.tsx`
  - Scope: Small

- [ ] Task 9: 게시글 삭제
  - Acceptance: POST /board/:id/delete 삭제 후 목록 리다이렉트
  - Verify: 삭제 → 목록에서 사라짐 확인
  - Files: `src/routes/board.tsx`
  - Scope: Small

### Checkpoint: Core Features
- [ ] 전체 CRUD 동작 확인
- [ ] QR 코드 표시 확인
- [ ] 페이지네이션 동작 확인

### Phase 3: Polish (마무리)

- [ ] Task 10: 반응형 디자인 및 UI 개선
  - Acceptance: 모바일/데스크톱 모두 잘 보임
  - Verify: 320px ~ 1440px 뷰포트 확인
  - Files: `src/views/`, `src/public/style.css`
  - Scope: Medium

- [ ] Task 11: 입력 유효성 검증 및 에러 처리
  - Acceptance: 빈 제목 방지, XSS 방지, 존재하지 않는 게시글 404
  - Verify: 잘못된 입력 시 에러 메시지 표시
  - Files: `src/routes/board.tsx`
  - Scope: Small

- [ ] Task 12: 테스트 작성
  - Acceptance: DB 헬퍼 + API 라우트 테스트
  - Verify: `npm test` 100% 통과
  - Files: `tests/`
  - Scope: Medium

### Checkpoint: Complete
- [ ] 모든 성공 기준 충족
- [ ] 테스트 통과
- [ ] `npm run dev` 동작 확인

## Risks and Mitigations

| Risk | Impact | Mitigation |
|:---|:---|:---|
| better-sqlite3 빌드 실패 | High | node-gyp 환경 확인, 대안: sql.js |
| HTMX CDN 접근 불가 | Low | 로컬 파일로 대체 |
| QR 코드 생성 실패 | Low | qrcode 라이브러리 안정적 |
