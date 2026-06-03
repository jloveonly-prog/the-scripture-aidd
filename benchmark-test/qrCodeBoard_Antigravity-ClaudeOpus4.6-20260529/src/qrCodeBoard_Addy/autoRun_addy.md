# 🚀 AutoRun — Agent-Skills 자동 실행 지침 (전체 스킬 최대 활성화)

> 이 파일은 AI가 읽고 전 과정을 자동으로 완료하기 위한 실행 지침입니다.
> 사용자 확인/승인 없이 끝까지 자동 진행합니다.
> **공정한 비교를 위해 Agent-Skills의 모든 유효 스킬을 최대한 활성화합니다.**

---

## ⚠️ 0단계: 초기화 (클린 실행 보장)

> 이전 실행 결과가 남아있으면 비교 실험이 오염된다. 반드시 먼저 초기화하라.

아래 경로의 내용을 **삭제**하고 빈 폴더로 초기화해라:
- `docs/` 하위 모든 파일/폴더 삭제
- `src/` 하위 모든 파일/폴더 삭제

초기화 완료 후 시작 시각을 기록하고 1단계부터 진행해라.

---

## 요구사항
→ `req.md`를 읽어라.

## 기술 스택
- 백엔드: Node.js (Hono)
- 프론트: Hono JSX + HTMX + Alpine.js + Tailwind
- DB: SQLite
- 인프라: 로컬 PC

---

## 실행 순서

아래 단계를 **중단 없이 자동으로** 진행해라.
각 단계에서 해당 SKILL.md를 반드시 읽고 그 지침을 따라라.

---

### 1단계 DEFINE — 요구사항 정제 및 명세화

**1-1. 요구사항 정제**
- `agent-skills/skills/idea-refine/SKILL.md` 읽기
- `agent-skills/skills/doubt-driven-development/SKILL.md` 읽기
  - CLAIM → EXTRACT → DOUBT → RECONCILE → STOP 절차 적용
  - 모든 비자명한 결정에 적대적 검토 적용
- req.md 요구사항 모호성 제거, 경계 명확화

**1-2. 스펙 작성**
- `agent-skills/skills/spec-driven-development/SKILL.md` 읽기
- `docs/`에 PRD 작성 (목표, 명령어, 구조, 코드 스타일, 테스트, 경계 포함)

---

### 2단계 PLAN — 설계 및 태스크 분해

**2-1. API 및 인터페이스 설계**
- `agent-skills/skills/api-and-interface-design/SKILL.md` 읽기
  - Contract-first 설계, 에러 시맨틱, 경계 검증
  - `references/` 참고

**2-2. 태스크 분해**
- `agent-skills/skills/planning-and-task-breakdown/SKILL.md` 읽기
- `agent-skills/skills/context-engineering/SKILL.md` 읽기
  - 대형 프로젝트 컨텍스트 패킹, 세션 관리
- `agent-skills/skills/documentation-and-adrs/SKILL.md` 읽기
  - 아키텍처 결정 기록 (ADR)
- `docs/`에 태스크 분해 + ADR 작성

---

### 3단계 BUILD — 코드 구현

**3-1. 구현 준비**
- `agent-skills/skills/source-driven-development/SKILL.md` 읽기
  - 모든 프레임워크 결정을 공식 문서로 근거 제시
  - Hono, SQLite, Alpine.js, HTMX 공식 문서 참조

**3-2. 프론트엔드 구현**
- `agent-skills/skills/frontend-ui-engineering/SKILL.md` 읽기
  - 컴포넌트 아키텍처, 디자인 시스템, 상태 관리
  - 반응형 디자인, WCAG 2.1 AA 접근성
  - `references/accessibility-checklist.md` 참고

**3-3. 백엔드 구현**
- `agent-skills/skills/incremental-implementation/SKILL.md` 읽기
  - Thin vertical slices — 구현 → 테스트 → 검증 반복
  - 기능 플래그, 안전한 기본값, 롤백 가능한 변경
- `src/`에 코드 구현

---

### 4단계 VERIFY — 검증

**4-0. 브라우저 런타임 검증**
- `agent-skills/skills/browser-testing-with-devtools/SKILL.md` 읽기
  - DOM 검사, 콘솔 로그, 네트워크 트레이스
  - QR: 카메라 권한, 스캔 UI 브라우저 동작 검증
  - 쇼핑몰: 장바구니/결제 UI 브라우저 검증

**4-1. 에러 디버깅**
- `agent-skills/skills/debugging-and-error-recovery/SKILL.md` 읽기
  - 5단계 트리아지: 재현 → 위치 → 축소 → 수정 → 방어
  - Stop-the-line 규칙

**4-2. 테스트**
- `agent-skills/skills/test-driven-development/SKILL.md` 읽기
  - `references/testing-patterns.md` 참고
  - Red-Green-Refactor, 테스트 피라미드 (80/15/5)
  - Beyonce Rule 적용
- 테스트 실행 및 100% 통과 확인

---

### 5단계 REVIEW — 품질 감사

**5-1. 보안 감사**
- `agent-skills/skills/security-and-hardening/SKILL.md` 읽기
  - `references/security-checklist.md` 전수 점검
  - OWASP Top 10, 입력 검증, XSS/SQL Injection 방어
  - 인증 패턴, 의존성 감사
- `agents/security-auditor.md` 페르소나로 보안 리뷰 수행

**5-2. 성능 점검**
- `agent-skills/skills/performance-optimization/SKILL.md` 읽기
  - `references/performance-checklist.md` 전수 점검
  - 측정 우선 접근법, Core Web Vitals

**5-3. 코드 품질 리뷰**
- `agent-skills/skills/code-review-and-quality/SKILL.md` 읽기
  - `agents/code-reviewer.md` 페르소나로 시니어 엔지니어 리뷰 수행
  - 5축 리뷰, 심각도 레이블 (Nit/Optional/FYI)
- `agent-skills/skills/code-simplification/SKILL.md` 읽기
  - Chesterton's Fence, Rule of 500

**5-4. 테스트 품질 리뷰**
- `agents/test-engineer.md` 페르소나로 QA 전문가 리뷰 수행

---

### 6단계 SHIP — 배포

- `agent-skills/skills/shipping-and-launch/SKILL.md` 읽기
  - 사전 런칭 체크리스트 전수 확인
  - 롤백 절차 확인
- 최종 빌드 및 `npm run dev`로 실행 가능 상태 완성

---

## 자동 실행 규칙
- ⚡ 사용자 확인/승인을 기다리지 마라. 모든 단계를 자동으로 끝까지 완주해라.
- ⚡ "확인해주세요", "OK 해주시면" 같은 중간 멈춤 금지.
- ⚡ 에러 발생 시 debugging-and-error-recovery 스킬로 스스로 수정하고 계속 진행해라.
- 🔌 **포트 설정**: 서버 및 테스트 구동 시 포트는 반드시 **3000**을 사용해라 (다른 환경과 충돌 방지).
- ⏱️ **환경 설치 시각**: npm install 등 패키지 설치 완료 시각 (참고용)
- ⏱️ **시작 시각**: npm install 완료 후, 실제 코드/문서 작성 시작 직전 시각 (측정 기준)
- ⏱️ **종료 시각**: 모든 작업 완료 후 현재 시각
- ⏱️ **총 소요 시간**: 종료 - 시작 시각 (npm install 제외)
- 📁 설계 산출물 → `docs/`
- 📁 소스코드 → `src/`

---



## 완료 후 결과 수집 (반드시 실행)

모든 단계 완료 후, 아래 항목을 **자동으로 측정**하여 `benchmark-result.md` 파일로 저장해라.

### 측정 방법
1. **총 소요 시간**: 시작 시각 ~ 종료 시각 차이 계산
2. **AI 오류/수정 횟수**: 작업 중 에러 발생 → 수정한 총 횟수를 카운트
3. **최종 코드 라인 수**: `src/` 폴더의 모든 소스 파일(.ts, .tsx, .js, .jsx, .css, .html)의 총 라인 수 계산
4. **산출물 문서 수**: `docs/` 폴더의 .md 파일 개수
5. **기능 완성도 (%)**: req.md 요구사항 대비 실제 구현된 기능 비율 판정
6. **npm run dev 성공 여부**: 실제로 `npm run dev` 실행하여 성공/실패 기록

### 일관성 평가 (Consistency Evaluation)

> 프로젝트 규모가 커질수록 코드 일관성이 품질을 좌우하는 핵심 지표.
> 아래 5개 항목을 전수 조사하여 점수를 매겨라.

#### 평가 기준

| # | 평가 항목 | 측정 방법 | 배점 |
|:--|:---------|:---------|:---:|
| C-1 | **네이밍 통일성** | DB 칼럼명, API 필드명, 프론트 변수명이 동일 엔티티에 대해 일관된 명명 규칙을 따르는가? | /20 |
| C-2 | **API-DB-화면 정합성** | DB 스키마의 칼럼 → API 응답 필드 → 화면 표시가 빠짐·불일치 없이 연결되는가? | /20 |
| C-3 | **용어 통일성** | 코드 전체에서 동일 개념에 동일 용어를 사용하는가? (예: "주문"을 order/purchase/buy 혼용 여부) | /20 |
| C-4 | **산출물↔코드 추적성** | 설계 문서(PRD/태스크 분해)에 정의된 내용이 코드에 그대로 반영되었는가? 설계에 없는 임의 구현이 없는가? | /20 |
| C-5 | **프로세스 준수성** | 각 단계별로 지시된 가이드라인(스킬 지침 등)을 생략하지 않고 문서/코드/로그에 수행 흔적을 명확히 남겼는가? | /20 |

#### 채점 기준 (항목당 20점)
- **20점**: 불일치/누락 0건
- **16점**: 불일치/누락 1~2건 (사소한 수준)
- **12점**: 불일치/누락 3~5건
- **8점**: 불일치/누락 6~10건
- **4점**: 불일치/누락 10건 이상
- **0점**: 체계 자체가 없음

### 저장 형식 (benchmark-result.md)
```markdown
# 벤치마크 결과 — A조 Agent-Skills

| 항목 | 결과 |
|:---|:---|
| 환경 설치 시각 | {npm install 완료 시각} |
| 시작 시각 | {코딩 시작 시각} |
| 종료 시각 | {시각} |
| 총 소요 시간 | {분:초} (npm install 제외) |
| AI 오류/수정 횟수 | {N}회 |
| 최종 코드 라인 수 | {N}줄 |
| 산출물 문서 수 | {N}개 |
| 기능 완성도 | {N}% |
| npm run dev | 성공/실패 |

## 일관성 평가

| 항목 | 점수 | 불일치 건수 | 비고 |
|:---|:---:|:---:|:---|
| C-1 네이밍 통일성 | /20 | {N}건 | {불일치 상세} |
| C-2 API-DB-화면 정합성 | /20 | {N}건 | {불일치 상세} |
| C-3 용어 통일성 | /20 | {N}건 | {불일치 상세} |
| C-4 산출물↔코드 추적성 | /20 | {N}건 | {불일치 상세} |
| C-5 프로세스 준수성 | /20 | {N}건 | {누락 상세} |
| **합계** | **/100** | | |

## 구현된 기능 목록
{req.md 기반으로 자동 생성}

## 에러 로그
{발생한 에러와 수정 내역}
```
