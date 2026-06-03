# ADR — QR Code Board

## ADR-001: QR 스캐너 라이브러리 선택

**결정:** html5-qrcode 사용

**근거:**
- Google ZXing 라이브러리 기반 (공식 Google QR 스캐너)
- 카메라 API 추상화, 다양한 QR/바코드 포맷 지원
- npm 패키지로 쉽게 통합 가능
- 적극 유지보수 중 (2024 기준)

**NOT DOING:** ZXing-js 직접 사용 — html5-qrcode가 더 쉬운 추상화 제공

---

## ADR-002: SSR + HTMX 아키텍처

**결정:** Hono JSX로 서버사이드 렌더링 + HTMX로 동적 상호작용

**근거:**
- 단순한 CRUD + QR 스캐너 앱에 SPA 불필요
- HTMX로 페이지 리로드 없이 목록 갱신 가능
- Alpine.js로 QR 스캔 상태 관리 (카메라 on/off, 결과 표시)
- req.md 명시 스택 준수

---

## ADR-003: SQLite + better-sqlite3

**결정:** better-sqlite3 사용 (동기 API)

**근거:**
- 로컬 PC 단일 사용자 → 동기 API로 충분
- 비동기 복잡도 불필요
- Hono와 충돌 없음

---

## ADR-004: Tailwind CSS CDN (개발용)

**결정:** Tailwind CSS Play CDN 사용 (개발/데모)

**근거:**
- 빌드 파이프라인 설정 복잡도 제거
- 로컬 PC 단일 사용자 앱에서 성능 무관
- req.md Tailwind 명시

**NOT DOING:** PostCSS/CLI 빌드 — 오버엔지니어링
