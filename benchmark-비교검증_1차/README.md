# 🔬 benchmark-비교검증 — AIDD 방법론 벤치마크

## 실험 목적
동일한 요구사항(QR 코드 게시판)을 두 가지 AI 개발 방법론으로 구현하여 결과물 품질을 비교합니다.

---

## 실험 대상

| 구분 | A조 (Agent-Skills) | B조 (The Scripture AIDD) |
|:---|:---|:---|
| **폴더** | `F:\qrCodeBoard_Addy\` | `F:\qrCodeBoard_TheScripture\` |
| **방법론** | Addy Osmani의 Agent-Skills | The Scripture AIDD |
| **개발자** | 구글 크롬 수석 엔지니어 | jloveonly-prog |
| **철학** | Skill-First (22개 스킬 체크리스트) | Spec-First (성경=절대 Spec) |
| **도구** | Antigravity IDE | Antigravity IDE |
| **AI 모델** | 동일 모델 사용 | 동일 모델 사용 |
| **실행 방식** | `autoRun.md` 1회 입력, 자동승인 | 동일 |

## 동일 요구사항
- QR 코드 스캔 → 홈페이지 랜딩
- 게시판 1개 (CRUD)
- 기술 스택: Hono + HTMX + Alpine.js + Tailwind + SQLite

---

## 📂 폴더 구조

```
benchmark-비교검증\
├── README.md                    ← 이 파일
├── result-결과수집\              ← 양쪽 실행 후 원본 데이터 수집
│   ├── addy-결과.md             ← A조 실행 결과 로그
│   └── scripture-결과.md        ← B조 실행 결과 로그
├── analysis-분석\               ← 정량/정성 비교 분석
│   ├── code-quality-코드품질.md
│   ├── doc-coverage-문서커버리지.md
│   └── hallucination-할루시네이션.md
└── report-보고서\               ← 최종 비교 보고서
    └── final-report-최종보고서.md
```

---

## 📊 비교 측정 항목

### 1. 정량 비교 (Quantitative)

| # | 측정 항목 | 설명 | A조 (Addy) | B조 (Scripture) |
|:--|:---|:---|:---:|:---:|
| 1 | **총 소요 시간** | 첫 프롬프트 ~ 최종 실행 성공까지 | | |
| 2 | **AI 프롬프트 횟수** | 총 입력 프롬프트 수 | | |
| 3 | **AI 오류/수정 횟수** | AI가 틀려서 수정한 횟수 | | |
| 4 | **최종 코드 라인 수** | 산출된 소스 코드 총 라인 | | |
| 5 | **산출물 문서 수** | 설계서, PRD 등 문서 파일 수 | | |
| 6 | **기능 완성도 (%)** | 요구사항 대비 구현 완료 비율 | | |
| 7 | **npm run dev 성공** | 실행 가능 여부 | | |

### 2. 정성 비교 (Qualitative)

| # | 검증 항목 | A조 (Addy) | B조 (Scripture) |
|:--|:---|:---:|:---:|
| 1 | **설계-코드 정합성** — 설계 문서와 실제 코드가 일치하는가? | | |
| 2 | **할루시네이션 여부** — 요구사항에 없는 임의 구현이 있는가? | | |
| 3 | **코드 구조** — 파일/폴더 구조가 체계적인가? | | |
| 4 | **보안** — SQL 인젝션, XSS 등 기본 보안이 적용되었는가? | | |
| 5 | **UI/UX 완성도** — 반응형, 디자인 품질 | | |
| 6 | **에러 핸들링** — 예외 처리가 되어있는가? | | |
| 7 | **코드 품질 점수** — 제3자 리뷰 또는 자동화 도구 기준 | | |

### 3. 구조적 차이 분석

| 관점 | A조 (Addy) | B조 (Scripture) |
|:---|:---|:---|
| 설계 방식 | Skill-First (각 단계 체크리스트) | Spec-First (설계 먼저, 코딩 나중) |
| 설계-코드 연결 | 없음 (각 SKILL 독립) | RTM으로 추적 (요구→설계→코드) |
| Anti-hallucination | 각 SKILL 내 테이블 | 십계명 + 마귀 축출 테이블 |
| 산출물 구조 | docs/ + src/ (자유) | bible-성경/(정경화) + fruit-열매/(코드) |

---

## 실행 순서

1. **A조 실행**: `F:\qrCodeBoard_Addy\` Antigravity IDE 워크스페이스 → `autoRun.md 읽고 실행해`
2. **B조 실행**: `F:\qrCodeBoard_TheScripture\` Antigravity IDE 워크스페이스 → `autoRun.md 읽고 실행해`
3. **결과 수집**: 양쪽 결과를 `result-결과수집/`에 기록
4. **분석**: `analysis-분석/`에 항목별 비교 분석
5. **보고서**: `report-보고서/final-report-최종보고서.md` 작성

---

## 공정성 보장

- ✅ 동일 요구사항 (`req.md` 내용 100% 동일)
- ✅ 동일 기술 스택 (Hono + HTMX + Alpine.js + Tailwind + SQLite)
- ✅ 동일 AI 도구 (Antigravity IDE)
- ✅ 동일 실행 방식 (프롬프트 1회 입력, 자동승인)
- ✅ 양쪽 코드 및 산출물 전부 공개 (재현 가능)

## 결과 보고서
실험 완료 후 이 폴더에 최종 비교 보고서를 작성합니다.
