# Implementation Plan: QR Code Board

## Overview

Node.js(Hono) + SQLite 기반 QR 게시판. 홈페이지에서 QR 코드를 스캔하고, 게시판 CRUD 기능을 제공한다.
수직 슬라이스 방식으로 기능 단위로 구현한다.

## Architecture Decisions

- Hono SSR(JSX) + HTMX: 서버 렌더링 + 부분 업데이트
- better-sqlite3: 동기 SQLite 드라이버 (Hono와 잘 맞음)
- html5-qrcode: 브라우저 카메라 QR 스캔 라이브러리 (CDN)
- Tailwind CSS: CDN 방식 (빌드 불필요)

## Task List

### Phase 1: Foundation (프로젝트 셋업 + DB)

- [ ] Task 1: 프로젝트 초기화 (package.json, tsconfig, 의존성 설치)
  - Acceptance: `npm run dev` 실행 시 포트 3000 정상 응답
  - Verify: curl http://localhost:3000 → 200 OK
  - Files: package.json, tsconfig.json, src/index.ts

- [ ] Task 2: DB 설정 (SQLite 스키마 + 초기화)
  - Acceptance: posts 테이블 생성됨
  - Verify: DB 파일 생성 확인
  - Files: src/db.ts

- [ ] Task 3: 공통 레이아웃 (Hono JSX + Tailwind + HTMX)
  - Acceptance: 기본 HTML 레이아웃 렌더링
  - Verify: 브라우저 접속 시 페이지 표시
  - Files: src/views/layout.tsx

### Checkpoint: Foundation
- [ ] 앱 실행 확인, DB 연결 확인

### Phase 2: Core Features (게시판 CRUD)

- [ ] Task 4: 게시판 목록 (GET /board)
  - Acceptance: 게시글 목록 테이블 표시
  - Verify: 브라우저에서 /board 접속
  - Files: src/routes/board.tsx, src/views/board/list.tsx

- [ ] Task 5: 게시판 작성 (GET /board/new + POST /board)
  - Acceptance: 폼 제출 시 DB 저장 후 목록으로 리다이렉트
  - Verify: 글 작성 후 목록에 표시
  - Files: src/routes/board.tsx, src/views/board/form.tsx

- [ ] Task 6: 게시판 상세 (GET /board/:id)
  - Acceptance: 글 내용 표시
  - Verify: /board/1 접속 시 내용 표시
  - Files: src/routes/board.tsx, src/views/board/detail.tsx

- [ ] Task 7: 게시판 수정 (GET /board/:id/edit + POST /board/:id/edit)
  - Acceptance: 기존 내용 로드 후 수정 저장
  - Verify: 수정 후 상세 페이지에서 변경 확인
  - Files: src/routes/board.tsx, src/views/board/form.tsx

- [ ] Task 8: 게시판 삭제 (POST /board/:id/delete)
  - Acceptance: 삭제 후 목록에서 제거
  - Verify: 삭제 버튼 클릭 후 목록 확인
  - Files: src/routes/board.tsx

### Checkpoint: Core Features
- [ ] 게시판 CRUD 전체 동작 확인

### Phase 3: QR 기능 + 홈페이지

- [ ] Task 9: 홈페이지 QR 스캔 (카메라 스캔 + 결과 표시)
  - Acceptance: 카메라로 QR 스캔 시 URL이 화면에 표시
  - Verify: 브라우저에서 QR 스캔 테스트
  - Files: src/routes/home.tsx, src/views/home.tsx, public/js/qr-scanner.js

### Checkpoint: Complete
- [ ] 전체 기능 동작 확인
- [ ] npm run dev 성공

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| 카메라 권한 거부 | High | HTTPS 또는 localhost 사용 (localhost는 카메라 허용됨) |
| Hono JSX 타입 오류 | Med | tsconfig에 JSX 설정 추가 |
| HTMX와 Alpine.js 충돌 | Low | 독립적 영역에서 사용 |

## Open Questions

없음
