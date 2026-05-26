---
id: SKILL-01
name: "들음 (Hearing)"
phase: "A_설계"
step: "01.requirement-hearing-들음"
depends_on: [bootstrap-creed-신앙고백]
---

# SKILL-01: 들음 (01.requirement-hearing-들음)

> *"So then faith cometh by hearing, and hearing by the word of God."* — Romans 10:17 (KJV)

## 📋 목적 (Purpose)
`hearing-들음/req.md`의 원본 요구사항을 듣고, 명세서·유스케이스·RTM을 작성하여 `bible-성경/01/`에 정경화한다.

## 🔗 사전 조건 (Prerequisites)
- ✅ Phase 0 완료 (bootstrap-creed-신앙고백.md 읽기, "나는 죄인이다" 선언)
- 📂 `hearing-들음/req.md`에 요구사항 존재

## ⚔️ 전신갑주 착용 — 이 Phase의 무장

🎭 **수석 비즈니스 분석가(BA)**로 행동하라.
- **요구공학의 체계적 도출법**: 비즈니스 목표, 기능 요구사항, 기술 표준을 누락 없이 구조화
- **넛지(Nudge) 기법**: 사용자 관점에서 전환율을 극대화하는 관점 적용

## 📎 태깅 대상 (Required Context)

**필수:**
- `@hearing-들음/req.md` (원본 요구사항)
- `@statute-율법/01.requirement-hearing-들음/*` (템플릿)

**선택 (품질 향상):**
- `@parable-비유/01.requirement-hearing-들음/*` (예시)

## 💬 실행 프롬프트

```markdown
# [들음] 01.requirement — 요구사항 도출

hearing-들음/req.md의 요구사항을 분석하여 설계 산출물을 생성하라.

⚠️ **왜-어떻게-무엇을 — 황금원 분석 (Golden Circle)**

> "Start with Why." — Simon Sinek  
> Scripture는 Why부터 듣는다. What만 보면 방향을 잃는다.

req.md의 각 기능을 아래 3단계로 분해하라. **이 순서대로 읽어라:**

| 단계 | 질문 | 이번 예시 |
|:--|:--|:--|
| **왜 (Why)** | 사용자가 이것을 왜 원하는가? | 빠른 정보 접근을 위해 |
| **어떻게 (How)** | 사용자가 어떤 행위를 하는가? | 카메라로 QR을 스캔한다 |
| **무엇을 (What)** | 시스템이 무엇을 만드는가? | 스캔된 내용을 화면에 표시 |

⚠️ **What만 보면 죄다.** "QR + 화면에 띄우는" = 생성기로 오해할 수 있다.
How(사용자 행위)를 먼저 확인하면 방향이 결정된다.

⚠️ **재료 검수 (Smart Validation)**
req.md를 분석하여 아래 필수 정보를 확인하라:
[ ] 1. 프로젝트의 핵심 목적과 비즈니스 목표
[ ] 2. 주요 기능 목록
[ ] 3. 기술 스택 (백엔드, 프론트, DB)
[ ] 4. 배포 환경

누락 항목이 있으면 번호 선택형 메뉴를 제시하라. 개방형 질문 금지.

⚠️ **가정 선언 — 내가 전하는 복음을 먼저 선언하라 (갈 1:8)**

> "내가 전한 복음을 다르게 전하면 저주를 받는다." — 갈라디아서 1:8

req.md를 해석하기 전, AI는 반드시 아래 형식으로 **가정을 먼저 명시**하라.
사용자 확인이 없는 자동 실행 조건에서는 **가장 문자 그대로의 해석**을 채택하고 진행하라.
침묵으로 가정하는 것은 죄다.

```
## 나의 해석 가정 (Assumptions)
| # | req.md 문장 | 나의 해석 | 근거 |
|:--|:--|:--|:--|
| 1 | "{req.md 모호한 문장}" | {How(사용자 행위 동사) 기반으로 결정한 해석} | {Why-How-What 분석 근거} |
| 2 | ... | ... | ... |
→ 위 해석이 틀렸다면 즉시 알려주세요.
```

⚠️ **불명확한 말씀 — 열린 질문 (Open Questions)**

> 선지자에게 묻지 않은 가정은 할루시네이션의 씨앗이다.

req.md에서 **중의적이거나 모호한 표현**을 발견하면 반드시 명세서 안에 Open Questions 섹션을 만들고 기록하라.
자동 실행 조건에서는 질문을 기록하되, **가장 일반적이고 문자적인 해석으로 진행**하라.

```
## Open Questions (열린 질문)
| # | 모호한 표현 | 채택한 해석 | 확인 필요 여부 |
|:--|:--|:--|:--|
| 1 | "{req.md 중의적 표현}" | {AI가 채택한 해석} | 확인 권장 |
```

⚠️ **산출물 순차 생산 (한 번에 하나씩)**
아래 순서대로 하나씩 생성하고, 각 파일 완성 후 사용자 확인을 받아라.

| 순서 | 파일 | 템플릿 |
|:--:|:--|:--|
| ① | spec-tablet-명세서.md | statute-율법/01/spec-tablet-명세서-template.md |
| ② | usecase-path-사용사례.md | statute-율법/01/usecase-path-사용사례-template.md |
| ③ | rtm-covenant-언약추적.md | statute-율법/01/rtm-covenant-언약추적-template.md |

산출물은 `bible-성경/01.requirement-hearing-들음/`에 생성하라.
품질은 `parable-비유/01/`의 예시 수준을 맞춰라.
⚠️ statute-율법/ 템플릿 원본을 수정하지 마라.
```

## ⚔️ 마귀 경고 (이 Phase에서 출몰하는 마귀들)

| 마귀의 속삭임 | 전신갑주 대응 |
|:--|:--|
| "요구사항 안 들어도 대충 알지" | 📐 진리의 허리띠: 듣지 않으면 믿음이 없다 (Romans 10:17) |
| "범위 안 정해도 되지" | 👟 평안의 신발: 범위 없으면 구원도 없다 |
| "기술 스택은 나중에 정하자" | ⛑️ 구원의 투구: 기초 없이 성전을 세우면 무너진다 |

## 📦 산출물 (Output)

| 파일명 | 저장 경로 |
|:--|:--|
| `spec-tablet-명세서.md` | `bible-성경/01.requirement-hearing-들음/` |
| `usecase-path-사용사례.md` | `bible-성경/01.requirement-hearing-들음/` |
| `rtm-covenant-언약추적.md` | `bible-성경/01.requirement-hearing-들음/` |

## 🔍 심판 관문 (Gate Check)
> `gate-judgment-심판관문.md`의 범용 심판을 실행하라.
> 추가 심판: 모든 요구사항에 REQ-ID가 부여되었는가?
> 모두 ✅이면 정경화 → Phase 2 진행. ❌이면 회개 후 재심판.

## ➡️ 다음 단계
→ `SKILL-02_foundation-기초.md`
