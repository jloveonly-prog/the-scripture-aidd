# 🚀 AutoRun — Agent-Skills 자동 실행 지침

> 이 파일은 AI가 읽고 전 과정을 자동으로 완료하기 위한 실행 지침입니다.
> 사용자 확인/승인 없이 끝까지 자동 진행합니다.

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

## 실행 순서

아래 6단계를 **중단 없이 자동으로** 진행해라.
각 단계에서 해당 SKILL.md를 반드시 읽고 그 지침을 따라라.

### 1단계 DEFINE
- `agent-skills/skills/spec-driven-development/SKILL.md` 읽기
- `docs/`에 PRD 작성

### 2단계 PLAN
- `agent-skills/skills/planning-and-task-breakdown/SKILL.md` 읽기
- `docs/`에 태스크 분해

### 3단계 BUILD
- `agent-skills/skills/incremental-implementation/SKILL.md` 읽기
- `src/`에 코드 구현

### 4단계 TEST
- `agent-skills/skills/test-driven-development/SKILL.md` 읽기
- 테스트 실행

### 5단계 REVIEW
- `agent-skills/skills/code-review-and-quality/SKILL.md` 읽기
- 코드 품질 점검

### 6단계 SHIP
- `agent-skills/skills/shipping-and-launch/SKILL.md` 읽기
- 최종 빌드 및 `npm run dev`로 실행 가능 상태 완성

## 자동 실행 규칙
- ⚡ 사용자 확인/승인을 기다리지 마라. 모든 단계를 자동으로 끝까지 완주해라.
- ⚡ "확인해주세요", "OK 해주시면" 같은 중간 멈춤 금지.
- ⚡ 에러 발생 시 스스로 수정하고 계속 진행해라.
- ⏱️ **환경 설치 시각**: npm install 등 패키지 설치 완료 시각 (참고용)
- ⏱️ **시작 시각**: npm install 완료 후, 실제 코드/문서 작성 시작 직전 시각 (측정 기준)
- ⏱️ **종료 시각**: 모든 작업 완료 후 현재 시각
- ⏱️ **총 소요 시간**: 종료 - 시작 시각 (npm install 제외)
- 📁 설계 산출물 → `docs/`
- 📁 소스코드 → `src/`

## 완료 후 결과 수집 (반드시 실행)

모든 단계 완료 후, 아래 항목을 **자동으로 측정**하여 `benchmark-result.md` 파일로 저장해라.

### 측정 방법
1. **총 소요 시간**: 시작 시각 ~ 종료 시각 차이 계산
2. **AI 오류/수정 횟수**: 작업 중 에러 발생 → 수정한 총 횟수를 카운트
3. **최종 코드 라인 수**: `src/` 폴더의 모든 소스 파일(.ts, .tsx, .js, .jsx, .css, .html)의 총 라인 수 계산
4. **산출물 문서 수**: `docs/` 폴더의 .md 파일 개수
5. **기능 완성도 (%)**: req.md 요구사항 대비 실제 구현된 기능 비율 판정
6. **npm run dev 성공 여부**: 실제로 `npm run dev` 실행하여 성공/실패 기록

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

## 구현된 기능 목록
- [ ] 홈페이지
- [ ] 게시판 목록
- [ ] 게시판 작성
- [ ] 게시판 상세
- [ ] 게시판 수정
- [ ] 게시판 삭제
- [ ] QR 코드

## 에러 로그
{발생한 에러와 수정 내역}
```
