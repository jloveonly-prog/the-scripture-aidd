# 태스크 분해 — QR Code Board

## Overview
QR 코드 스캐너 + 게시판 웹앱을 수직 슬라이싱으로 구현.
의존성 순서: 프로젝트 초기화 → DB → API → UI

---

## Phase 1: 프로젝트 기반 세팅

- [x] Task 1: package.json, tsconfig.json, npm 초기화
  - Acceptance: npm install 성공, node_modules 생성
  - Files: package.json, tsconfig.json
  - Scope: S

- [x] Task 2: DB 초기화 (src/db.ts)
  - Acceptance: posts 테이블 생성, CRUD 함수 동작
  - Files: src/db.ts
  - Scope: S

### Checkpoint 1
- [x] npm install 성공
- [x] DB 모듈 import 오류 없음

---

## Phase 2: API 엔드포인트

- [x] Task 3: Hono 서버 + API 라우트 (src/index.ts, src/routes/api.ts)
  - Acceptance: POST /api/posts, GET /api/posts, DELETE /api/posts/:id 동작
  - Files: src/index.ts, src/routes/api.ts, src/types.ts
  - Scope: M

### Checkpoint 2
- [x] npm run dev 실행 → 포트 3000 응답
- [x] curl POST /api/posts 성공

---

## Phase 3: UI — 홈 (QR 스캐너)

- [x] Task 4: 공통 레이아웃 + 홈 페이지 (src/views/layout.tsx, src/routes/home.tsx)
  - Acceptance: / 접근 시 QR 스캐너 UI 표시, 카메라 권한 요청
  - Files: src/views/layout.tsx, src/routes/home.tsx
  - Scope: M

### Checkpoint 3
- [x] 브라우저에서 QR 스캐너 카메라 동작 확인

---

## Phase 4: UI — 게시판

- [x] Task 5: 게시판 페이지 (src/routes/board.tsx)
  - Acceptance: /board 접근 시 게시물 목록 표시, 삭제 동작
  - Files: src/routes/board.tsx
  - Scope: M

### Checkpoint 4
- [x] 스캔 결과 → 게시판에 저장 → 목록 표시 흐름 동작

---

## Phase 5: 테스트 + 최종 검증

- [x] Task 6: API 통합 테스트 (tests/api.test.ts)
  - Acceptance: POST/GET/DELETE 테스트 통과
  - Files: tests/api.test.ts
  - Scope: S

- [x] Task 7: 벤치마크 결과 파일 작성

### Checkpoint 5 (Final)
- [x] npm test 통과
- [x] npm run dev 성공
- [x] 전체 사용자 흐름 동작

---

## Risks

| Risk | Impact | Mitigation |
|:---|:---|:---|
| 카메라 권한 거부 | High | HTTPS 또는 localhost 안내 |
| html5-qrcode CDN 로드 실패 | Medium | npm 패키지로 번들링 |
| better-sqlite3 Windows 빌드 오류 | Medium | node-gyp 사전 설치 확인 |
