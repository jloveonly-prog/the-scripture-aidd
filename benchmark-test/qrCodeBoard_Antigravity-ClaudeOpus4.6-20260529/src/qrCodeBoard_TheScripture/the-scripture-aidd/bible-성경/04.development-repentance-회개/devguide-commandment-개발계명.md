# ⚖️ 개발 계명 — QR Code 게시판 홈페이지

> *"Repent: for the kingdom of heaven is at hand."* — Matthew 3:2 (KJV)

---

## 계층 분리 결정

| 레이어 | 파일 패턴 | 책임 |
|:---|:---|:---|
| HTTP 핸들러 | `src/routes/*.tsx` | 요청 수신 → 응답 반환 |
| 화면 템플릿 | `src/views/**/*.tsx` | UI 렌더링만 |
| 비즈니스 로직 | `src/services/*.ts` | 검증, 비즈니스 규칙 |
| 데이터/DB | `src/db/*.ts` | DB 연결, 쿼리 |

## 분리 근거

- CRUD(게시판) 포함 → CRUD 강제 분리 규칙 적용
- Phase 2 폴더 구조 판단 체크리스트 #1 YES
- 모든 파일이 단일 책임 유지 (300줄 이하)

## 앱 인스턴스 Export

- `src/index.ts`에서 `export default app` 구현
- HTTP 통합 테스트에서 `import app from '../src/index.js'`로 사용 가능

## 예외처리 패턴

- 모든 라우트에 `try-catch` 적용
- DB 에러 → 500 + 사용자 메시지
- 404 → HTML 안내 페이지
- 입력 검증 실패 → 400 + 폼 재표시

## 3중 방어 깊이

| 층 | 위치 | 방어 |
|:---|:---|:---|
| 1 | 클라이언트 | HTML `required`, Alpine.js |
| 2 | 서버 | `boardService.validatePostInput()` — trim + 빈값 체크 |
| 3 | DB | `CHECK(length(trim(column)) > 0)` |

## 네이밍 규칙

| 대상 | 규칙 |
|:---|:---|
| DB 테이블 | snake_case, 복수형 (`posts`) |
| DB 컬럼 | snake_case (`created_at`) |
| TypeScript 변수 | camelCase (`boardService`) |
| 파일명 | camelCase (`boardService.ts`) |
| 컴포넌트 | PascalCase (`BoardList`) |
