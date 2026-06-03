# 🔨 개발 가이드 — The Scripture Shop (성경 쇼핑몰)

> **정경(Bible):** 이 문서는 The Scripture Shop 프로젝트의 개발 가이드이다.
> 개발 시 본 가이드의 코딩 컨벤션과 봉인의 율법(보안 규칙)을 준수해야 한다.

---

## 1. 프로젝트 설정

- **언어:** Node.js (TypeScript)
- **프레임워크:** Hono (Hono JSX for views)
- **패키지 매니저:** npm
- **DB:** SQLite (using `better-sqlite3` or similar SQLite driver)

---

## 2. 디렉토리 구조

```
fruit-열매/
├── db/
│   ├── client.ts             # SQLite DB 커넥션 및 스키마 DDL 실행
│   └── seed.ts               # 초기 10개 성경 Seed 데이터 주입
├── services/
│   ├── shop.service.ts       # 성경 조회, 장바구니 추가/수정, 주문 생성 서비스
│   └── admin.service.ts      # 관리자 로그인, 주문 목록 필터링, 발송 완료 처리 서비스
├── views/
│   ├── layout.tsx            # HTML 기본 뼈대, Tailwind, Alpine, HTMX 스크립트 선언
│   ├── shop.tsx              # 메인 카탈로그 화면, 장바구니/주문 완료 UI
│   └── admin.tsx             # 관리자 로그인, 대시보드 및 상세 패널 UI
├── routes/
│   ├── shop.ts               # 비회원 쇼핑몰 웹 라우팅 핸들러
│   └── admin.ts              # 관리자 인증 및 대시보드 제어 라우팅 핸들러
├── test/
│   └── app.test.ts           # Hono app 인스턴스 기반 통합 테스트
├── history/
│   └── YYYY-MM-DD.md         # 작업 이력 로그 (Commandment 2)
├── index.ts                  # Hono 서버 진입점 및 포트 바인딩 (Export app)
├── package.json              # 의존성 및 npm test 실행 명령어 정의
└── tsconfig.json             # TypeScript 컴파일러 설정
```

---

## 3. 코딩 컨벤션

- **파일명/변수명:**
  - TypeScript/TSX 파일: camelCase 또는 kebab-case (`shop.service.ts`, `layout.tsx`)
  - 변수 및 함수: camelCase (`createOrder`, `getBibles`)
  - DB 필드 및 SQL: snake_case (`order_number`, `tracking_number`)
- **주석:**
  - 구현하는 모든 주요 함수 및 분기 상단에 관련 요구사항 ID (`REQ-XXX`, `FR-XXX`)를 주석으로 반드시 남겨 추적성을 보장한다.
- **포맷팅:**
  - 탭 대신 공백 2칸 들여쓰기 준수.
  - Hono JSX 내부에서 HTML 인라인 스타일 사용을 지양하고 Tailwind CSS 유틸리티 클래스 위주로 구성.

---

## 4. 모듈별 개발 현황

| 모듈명 | 파일 경로 | 관련 REQ/ARCH | 상태 |
|:---|:---|:---|:---:|
| DB 설정 | `db/client.ts`, `db/seed.ts` | REQ-001, REQ-003 / TBL-001~003 | ⬜ 미착수 |
| 쇼핑몰 서비스 | `services/shop.service.ts` | REQ-001~004 / ARCH-001 | ⬜ 미착수 |
| 어드민 서비스 | `services/admin.service.ts` | REQ-005 / ARCH-001 | ⬜ 미착수 |
| 공통 레이아웃 | `views/layout.tsx` | C-002 | ⬜ 미착수 |
| 쇼핑몰 UI | `views/shop.tsx` | REQ-001~004 / SCR-001~003 | ⬜ 미착수 |
| 어드민 UI | `views/admin.tsx` | REQ-005 / SCR-004, SCR-005 | ⬜ 미착수 |
| 쇼핑몰 라우터 | `routes/shop.ts` | REQ-001~004 / API-001~008 | ⬜ 미착수 |
| 어드민 라우터 | `routes/admin.ts` | REQ-005 / API-009~013 | ⬜ 미착수 |
| 진입점 서버 | `index.ts` | C-001 | ⬜ 미착수 |
| 통합 테스트 | `test/app.test.ts` | REQ-001~005 | ⬜ 미착수 |

---

## 5. 코드 리뷰 체크리스트

모든 소스코드 커밋 또는 검증 전에 다음 5개 점검을 완료해야 한다.

- [ ] **제1계명 (개인정보 노출 방지):** 콘솔 로그, 에러 스택 혹은 디버깅 로그에 수령인 이름, 전화번호, 주소가 평문 노출되지 않는가?
- [ ] **제2계명 (시크릿 하드코딩 금지):** 어드민 세션 비밀키 등 민감정보가 하드코딩되지 않고 환경변수 또는 로컬 설정 파일로 관리되는가?
- [ ] **제3계명 (데이터 암호화):** 비회원 배송지 정보가 DB에 적재될 때 안전하게 제어되고 있으며, SQL Injection을 방어하기 위해 바인딩 파라미터가 적절히 적용되었는가?
- [ ] **제7계명 (접근 통제):** `/admin` 및 `/admin/*` 라우트는 로그인 세션이 유효한 권한자에게만 작동되도록 라우팅 가드가 완벽히 작동하는가?
- [ ] **3중 방어막 검수:** 프론트엔드(`required`, Alpine), 백엔드 핸들러 검증(`trim()`), 데이터베이스 `CHECK` 제약조건이 누락 없이 설정되었는가?

---

## 6. Git 커밋 컨벤션

모든 커밋 메시지는 다음 성경적 접두사를 접부하여 기록한다.

| 접두사 | 의미 | 매핑 |
|:---|:---|:---|
| `Genesis` | 새 기능 파일/모듈 최초 생성 | FEAT |
| `Refine` | 코드 구조 개선 | REFACTOR |
| `Repent` | 버그 해결 및 유효성 교정 | FIX |
| `Scroll` | 명세서, 설계 등 문서 수정 | DOCS |
| `Test` | 테스트용 파일 작성 및 추가 | TEST |
| `Deploy` | 배포 및 실행 설정 최적화 | DEPLOY |
