# 🚀 AutoRun — The Scripture AIDD 자동 실행 지침

> 이 파일은 AI가 읽고 전 과정을 자동으로 완료하기 위한 실행 지침입니다.
> 사용자 확인/승인 없이 끝까지 자동 진행합니다.

---

## ⚠️ 0단계: 초기화 (클린 실행 보장)

> 이전 실행 결과가 남아있으면 비교 실험이 오염된다. 반드시 먼저 초기화하라.

아래 경로의 내용을 **삭제**하고 빈 폴더로 초기화해라:
- `the-scripture-aidd/bible-성경/` 하위 모든 파일/폴더 삭제
- `the-scripture-aidd/fruit-열매/` 하위 모든 파일/폴더 삭제 (단, `fruit-열매/history/` 폴더는 유지)

초기화 완료 후 시작 시각을 기록하고 Phase 1부터 진행해라.

---

## 부팅
- `the-scripture-aidd/.skill/bootstrap-creed-신앙고백.md`를 읽고 내면화해라.
- "나는 죄인이다"를 선언하고 전신갑주를 착용해라.

## 요구사항
→ `the-scripture-aidd/hearing-들음/req.md`를 읽어라.

## 기술 스택
- 백엔드: Node.js (Hono)
- 프론트: Hono JSX + HTMX + Alpine.js + Tailwind
- DB: SQLite
- 인프라: 로컬 PC

## 실행 순서

아래 7개 Phase를 **중단 없이 자동으로** 진행해라.
각 Phase에서 해당 SKILL 파일을 반드시 읽고 그 지침을 따라라.

### Phase 1: 들음
- `the-scripture-aidd/.skill/SKILL-01_hearing-들음.md` 읽기
- `statute-율법/01` 템플릿 + `parable-비유/01` 예시 참고
- `bible-성경/01/`에 명세서 정경화

### Phase 2: 기초
- `the-scripture-aidd/.skill/SKILL-02_foundation-기초.md` 읽기
- `statute-율법/02` 템플릿 + `parable-비유/02` 예시 참고
- `bible-성경/02/`에 아키텍처 정경화

### Phase 3: 질서
- `the-scripture-aidd/.skill/SKILL-03_order-질서.md` 읽기
- `statute-율법/03` 템플릿 + `parable-비유/03` 예시 참고
- `bible-성경/03/`에 UI/UX 정경화

### Phase 4: 회개 (코딩)
- `the-scripture-aidd/.skill/SKILL-04_repentance-회개개발.md` 읽기
- `bible-성경/01~03`의 설계대로 `fruit-열매/`에 코드 구현
- 설계에 없는 임의 구현 금지

### Phase 5: 광야 (테스트)
- `the-scripture-aidd/.skill/SKILL-05_wilderness-광야.md` 읽기
- 자동화 테스트 작성 및 실행 (node:test)
- 3겹 검증 + 15기준 코드 검증

### Phase 6: 기록되었으되 (품질 감사)
- `the-scripture-aidd/.skill/SKILL-06_written-기록되었으되.md` 읽기
- 할루시네이션 감사 + IRONCLAD 판정

### Phase 7: 구원 (배포)
- `the-scripture-aidd/.skill/SKILL-07_salvation-구원.md` 읽기
- 7관문 체크 + 최종 빌드 및 `npm run dev`로 실행 가능 상태 완성

## 자동 실행 규칙
- ⚡ 사용자 확인/승인을 기다리지 마라. 모든 Phase를 자동으로 끝까지 완주해라.
- ⚡ "확인해주세요", "OK 해주시면" 같은 중간 멈춤 금지.
- ⚡ 에러 발생 시 성화의 회개(자율 디버깅)로 스스로 수정하고 계속 진행해라.
- ⏱️ **환경 설치 시각**: npm install 등 패키지 설치 완료 시각 (참고용)
- ⏱️ **시작 시각**: npm install 완료 후, 실제 코드/문서 작성 시작 직전 시각 (측정 기준)
- ⏱️ **종료 시각**: 모든 작업 완료 후 현재 시각
- ⏱️ **총 소요 시간**: 종료 - 시작 시각 (npm install 제외)
- 📁 설계 산출물 → `bible-성경/`
- 📁 소스코드 → `fruit-열매/`

## 완료 후 결과 수집 (반드시 실행)

모든 Phase 완료 후, 아래 항목을 **자동으로 측정**하여 `benchmark-result.md` 파일로 저장해라.

### 측정 방법
1. **총 소요 시간**: 시작 시각 ~ 종료 시각 차이 계산
2. **AI 오류/수정 횟수**: 작업 중 에러 발생 → 수정한 총 횟수를 카운트
3. **최종 코드 라인 수**: `fruit-열매/` 폴더의 모든 소스 파일(.ts, .tsx, .js, .jsx, .css, .html)의 총 라인 수 계산
4. **산출물 문서 수**: `bible-성경/` 폴더의 .md 파일 개수
5. **기능 완성도 (%)**: req.md 요구사항 대비 실제 구현된 기능 비율 판정
6. **npm run dev 성공 여부**: 실제로 `npm run dev` 실행하여 성공/실패 기록
7. **IRONCLAD 판정**: Phase 6 품질 감사 결과 (IRONCLAD/CONFIRMED/FAIL)

### 저장 형식 (benchmark-result.md)
```markdown
# 벤치마크 결과 — B조 The Scripture AIDD

| 항목 | 결과 |
|:---|:---|
| 환경 설치 시각 | {시각} |
| 시작 시각 | {시각} |
| 종료 시각 | {시각} |
| 총 소요 시간 | {분:초} |
| AI 오류/수정 횟수 | {N}회 |
| 최종 코드 라인 수 | {N}줄 |
| 산출물 문서 수 | {N}개 |
| 기능 완성도 | {N}% |
| npm run dev | 성공/실패 |
| IRONCLAD 판정 | IRONCLAD/CONFIRMED/FAIL |

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
