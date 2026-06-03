# 📖 개발 계명 — QR코드 게시판 (The Scripture)

> **bible-성경/04.development-repentance-회개/devguide-commandment-개발계명.md**

---

## 1. 아키텍처 결정 기록

### 폴더 구조 분리 결정
- **결정**: `routes/` (HTTP 처리) + `views/` (Hono JSX 렌더링) 완전 분리
- **근거**: CRUD 강제 분리 규칙 적용 (게시판: 목록/상세/작성 = CRUD 포함)
- **파일당 단일 책임**: 모든 파일 확인 완료

### HTTP 앱 Export 결정
- **결정**: `src/index.ts` 마지막에 `export default app` 추가
- **근거**: SKILL-04 지침 — HTTP 통합 테스트를 위해 앱 인스턴스 export 필수
- **연결**: Phase 5 테스트에서 `import app from '../index.js'` 패턴 사용

### QR 스캐너 구현 결정
- **결정**: Alpine.js + BarcodeDetector API 조합
- **근거**: REQ-001 "웹사이트 내 카메라 스캔" — 순수 클라이언트 사이드 처리
- **제약**: BarcodeDetector API는 Chrome/Edge 지원. 미지원 브라우저는 에러 표시
- **fallback**: BarcodeDetector 미지원 시 에러 메시지 표시 (try-catch)

### 게시글 수정/삭제 미구현
- **결정**: 구현하지 않음
- **근거**: req.md에 명시 없음 → Open Questions에 "확인 권장"으로 기록
- **자동실행 규칙**: 확장 해석 금지 → 축소(문자적) 해석으로 진행

---

## 2. 네이밍 컨벤션

| 대상 | 규칙 | 예시 |
|:---|:---|:---|
| DB 컬럼 | snake_case | `created_at`, `updated_at` |
| API 경로 | 소문자, 슬래시 | `/board`, `/board/:id` |
| 뷰 컴포넌트 | PascalCase | `BoardList`, `BoardForm` |
| 라우트 파일 | camelCase | `home.ts`, `board.ts` |
| 뷰 파일 | camelCase/index | `list.tsx`, `detail.tsx`, `form.tsx` |

---

## 3. 예외처리 전략

| 레이어 | 방식 | 구현 |
|:---|:---|:---|
| 라우트 | async try-catch | 모든 라우트에 try-catch 적용 |
| DB | 동기 (better-sqlite3) | 에러는 throw → 라우트 catch |
| 전역 | Hono onError | 500 응답 |
| 404 | Hono notFound | 404 응답 |

---

## 4. REQ-ID 주석 체계

```typescript
// 모든 비즈니스 로직 라인에 REQ-ID 주석
const posts = getAllPosts()  // REQ-004
createPost(title, content)  // REQ-005
const post = getPostById(id)  // REQ-006
```

---

## 5. 방어 깊이 (Defense in Depth) 구현

| 층 | 위치 | 구현 |
|:---|:---|:---|
| 1번째 (클라이언트) | `form.tsx` | `required`, `maxlength` HTML 속성 |
| 2번째 (서버) | `board.ts` | `trim()` + 빈값 체크 → 400 응답 |
| 3번째 (DB) | `schema.ts` | `CHECK(length(trim(title)) > 0)` |

---

## 6. 에러/수정 이력

| 시각 | 에러 | 수정 내용 |
|:---|:---|:---|
| — | — | 에러 발생 시 기록 |
