# ⚔️ 개발 계명 — QR코드 게시판

> *"Repent: for the kingdom of heaven is at hand."* — Matthew 3:2 (KJV)

---

## 구현 파일 목록

| 파일 | 책임 | 연결 REQ | 연결 API |
|:---|:---|:---|:---|
| `src/index.tsx` | 앱 진입점, Hono 서버 설정, 전역 에러 핸들러 | — | — |
| `src/db/schema.ts` | DB 스키마 정의 + 데이터 접근 서비스 | REQ-003 | — |
| `src/components/layout.tsx` | 공통 레이아웃 (Header/Footer/네비게이션) | REQ-002 | — |
| `src/routes/home.tsx` | 홈페이지 + QR 스캔 UI | REQ-001, REQ-002 | API-001 |
| `src/routes/board.tsx` | 게시판 CRUD 라우트 (목록/작성/상세/수정/삭제) | REQ-003 | API-002~008 |

---

## 계층 분리 판단

- **채택:** routes에 JSX 통합 (분리하지 않음)
- **근거:**
  - Hono JSX SSR 구조에서 라우트 핸들러가 직접 JSX를 반환하는 것이 공식 패턴
  - 화면 수 5개 미만, 각 라우트의 렌더링이 간단
  - DB 접근은 `db/schema.ts` 서비스 레이어로 분리 완료
  - HTTP 처리 + 렌더링이 결합되어 있으나, 비즈니스 로직(DB)은 분리됨

---

## 예외처리 현황

| 라우트 | 예외처리 | 처리 내용 |
|:---|:---:|:---|
| GET / | ✅ | try-catch, 500 에러 페이지 |
| GET /board | ✅ | try-catch, 500 에러 페이지 |
| GET /board/new | ✅ | try-catch |
| POST /board | ✅ | 유효성 검증(400) + try-catch(500) |
| GET /board/:id | ✅ | 404 + try-catch(500) |
| GET /board/:id/edit | ✅ | 404 + try-catch(500) |
| POST /board/:id/edit | ✅ | 유효성 검증(400) + 404 + try-catch(500) |
| POST /board/:id/delete | ✅ | 404 + try-catch(500) |
| 전역 404 | ✅ | app.notFound() |
| 전역 에러 | ✅ | app.onError() |

---

## 보안 적용 현황

| 항목 | 적용 |
|:---|:---|
| SQL Injection | ✅ Prepared Statement (better-sqlite3) |
| XSS | ✅ Hono JSX 자동 이스케이프 |
| 입력 검증 | ✅ 제목/내용 빈값 검증, maxlength |
| 삭제 확인 | ✅ confirm() 다이얼로그 |

---

## 임의 구현 검증

설계에 없는 임의 구현: **0건**

모든 코드는 `bible-성경/01~03/` 설계 산출물에 근거하여 구현됨.
