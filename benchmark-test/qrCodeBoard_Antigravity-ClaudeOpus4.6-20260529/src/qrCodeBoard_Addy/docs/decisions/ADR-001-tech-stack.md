# ADR-001: 기술 스택 선택

## Status
Accepted

## Date
2026-05-29

## Context
QR 코드 스캔 후 접속할 수 있는 홈페이지 및 게시판을 로컬 PC에서 구동.
요구사항에 기술 스택이 명시되어 있다.

## Decision
- **백엔드**: Hono (경량 웹 프레임워크, JSX 지원)
- **DB**: SQLite via better-sqlite3 (로컬 파일 DB, 설치 간편)
- **프론트엔드**: Hono JSX (서버사이드 렌더링) + HTMX (부분 렌더링) + Alpine.js (클라이언트 인터랙션) + Tailwind CSS CDN
- **QR**: qrcode npm 패키지 (SVG/Data URL 생성)

## Alternatives Considered

### Express.js
- Pros: 생태계 큼, 레퍼런스 많음
- Cons: JSX 미지원, 무거움
- Rejected: Hono가 요구사항에 명시됨

### PostgreSQL / MySQL
- Pros: 확장성, 동시 접속
- Cons: 별도 설치 필요, 로컬 환경 복잡
- Rejected: SQLite가 요구사항에 명시됨

### React / Vue SPA
- Pros: 풍부한 UI
- Cons: 빌드 필요, SSR 복잡
- Rejected: HTMX + Alpine.js가 요구사항에 명시됨

## Consequences
- Hono JSX로 서버사이드 렌더링하여 빌드 단계 불필요
- better-sqlite3는 동기 API → 서버 코드 단순화
- HTMX로 SPA 수준의 UX를 서버 렌더링으로 달성
- Tailwind CDN 사용으로 별도 빌드 불필요
