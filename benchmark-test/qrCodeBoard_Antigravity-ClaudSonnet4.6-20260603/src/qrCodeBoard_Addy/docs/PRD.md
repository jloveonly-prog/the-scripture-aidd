# Spec: QR Code Board (Addy)

## Objective

QR 코드를 카메라로 스캔하여 결과(URL/텍스트)를 화면에 즉시 표시하고,
게시판에 스캔 이력을 저장·조회할 수 있는 로컬 웹 애플리케이션.

**대상 사용자:** 로컬 PC 사용자 (단일 사용자)
**성공 기준:**
- 카메라로 QR 코드 스캔 → 결과가 화면에 즉시 표시
- 스캔 결과가 게시판에 자동 저장
- 게시판에서 목록 조회/삭제 가능
- `npm run dev` 실행 후 http://localhost:3000 에서 동작

## Tech Stack

| 레이어 | 기술 |
|:---|:---|
| 백엔드 | Node.js + Hono (TypeScript) |
| 프론트 | Hono JSX + HTMX + Alpine.js + Tailwind CSS |
| DB | SQLite (better-sqlite3) |
| QR 스캐너 | html5-qrcode (공식 Google ZXing 기반) |
| 인프라 | 로컬 PC |

## Commands

```bash
npm install        # 의존성 설치
npm run dev        # 개발 서버 시작 (포트 3000)
npm test           # 테스트 실행
npm run build      # 프로덕션 빌드 (필요 시)
```

## Project Structure

```
src/
  index.ts          → 앱 진입점 (Hono 서버)
  db.ts             → SQLite 초기화, 스키마
  routes/
    home.tsx        → 홈 (QR 스캐너 + 실시간 결과)
    board.tsx       → 게시판 (목록, 삭제)
    api.ts          → API 엔드포인트 (/api/posts)
  types.ts          → 공유 타입 정의
  views/
    layout.tsx      → 공통 레이아웃

public/
  tailwind.css      → Tailwind 빌드 결과

tests/
  api.test.ts       → API 통합 테스트

docs/
  PRD.md            → 이 파일
  ADR.md            → 아키텍처 결정 기록
  tasks.md          → 태스크 분해
  API.md            → API 설계
```

## Code Style

```typescript
// TypeScript strict mode
// 함수형 컴포넌트 (JSX)
// camelCase 변수/함수, PascalCase 컴포넌트
// DB 컬럼명: snake_case
// API 응답 필드명: camelCase

// 예시
export const PostRow = ({ post }: { post: Post }) => (
  <tr>
    <td>{post.id}</td>
    <td>{post.content}</td>
    <td>{post.createdAt}</td>
  </tr>
);
```

## Testing Strategy

- 테스트 프레임워크: vitest
- 위치: `tests/`
- 커버리지 목표: 핵심 API 80%+
- 테스트 수준: 단위(80%) + 통합(20%)
- 브라우저: 카메라 권한, QR 스캔 UI 수동 검증

## Boundaries

- **Always:** 타입 검증은 API 경계에서만, 모든 SQL은 파라미터화
- **Ask first:** DB 스키마 변경, 외부 의존성 추가
- **Never:** 비밀정보 하드코딩, SQL 문자열 직접 연결

## Success Criteria

- [ ] QR 스캐너 UI가 카메라 피드를 표시한다
- [ ] QR 코드 스캔 시 결과(URL/텍스트)가 화면에 표시된다
- [ ] 스캔 결과가 POST /api/posts로 자동 저장된다
- [ ] GET /api/posts 로 게시판 목록이 반환된다
- [ ] 게시판 페이지에서 목록을 볼 수 있다
- [ ] 게시물을 삭제할 수 있다
- [ ] npm run dev 로 포트 3000에서 실행된다
- [ ] 모든 API 테스트가 통과한다

## Open Questions

- QR 스캔 결과가 URL인 경우 링크로 표시? → **예, 링크로 표시**
- 게시판에 제목 필드 필요? → **불필요, content(스캔 결과)만**
- 페이지네이션 필요? → **단순 목록 (최신순 20개)**
