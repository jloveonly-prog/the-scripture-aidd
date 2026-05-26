---
id: SKILL-02
name: "기초 (Foundation)"
phase: "A_설계"
step: "02.architecture-foundation-기초"
depends_on: [SKILL-01]
---

# SKILL-02: 기초 (02.architecture-foundation-기초)

> *"And God made the firmament."* — Genesis 1:7 (KJV)

## 📋 목적 (Purpose)
기술 스택, ERD, API 명세, 보안 아키텍처를 설계하여 `bible-성경/02/`에 정경화한다.

## 🔗 사전 조건 (Prerequisites)
- ✅ SKILL-01 완료 (들음 산출물 정경화)
- 📂 `bible-성경/01/` 산출물 존재

## ⚔️ 전신갑주 착용

🎭 **수석 시스템 아키텍트**로 행동하라.
- **구조공학의 하중 분석**: 시스템의 하중(트래픽, 데이터)을 예측하고 그에 맞는 기초를 설계
- **방어적 아키텍처**: 보안을 처음부터 내장 (Security by Design)

## 📎 태깅 대상

**필수:**
- `@bible-성경/01.requirement-hearing-들음/*` (들음 산출물)
- `@statute-율법/02.architecture-foundation-기초/*` (템플릿)

**선택:**
- `@parable-비유/02.architecture-foundation-기초/*` (예시)

## 💬 실행 프롬프트

```markdown
# [기초] 02.architecture — 아키텍처 설계

Phase 1(들음)에서 정경화된 요구사항을 기반으로 시스템 아키텍처를 설계하라.

⚠️ **코드 폴더 구조 판단 — AI가 기술 스택을 보고 결정하라**

> 폴더 구조는 언어/프레임워크마다 다르다. 임의 구조를 강제하지 말고,
> **해당 기술 스택의 공식 컨벤션**을 따르되, 아래 기준으로 판단하라.

| 판단 기준 | 분리 권장 | 통합 허용 |
|:--|:--|:--|
| 뷰 파일이 복잡한가? (100줄+) | ✅ routes/ + views/ 분리 | |
| 프레임워크가 MVC 강제하는가? | ✅ 컨벤션 따라 분리 | |
| 단순 SSR (JSX in route)인가? | | ✅ routes 안에 JSX 허용 |
| 화면 수가 5개 미만인가? | | ✅ 통합 허용 |

**판단 결과를 `architecture-temple-성전설계.md`에 반드시 명시하라:**
```
## 폴더 구조 판단
- 채택 구조: [routes/ + views/ 분리 OR routes에 JSX 통합]
- 판단 근거: [기술 스택 컨벤션 + 복잡도 기준]
```

순차 생산:
| 순서 | 파일 | 템플릿 |
|:--:|:--|:--|
| ① | architecture-temple-성전설계.md | statute-율법/02/architecture-temple-성전설계-template.md |
| ② | data-ark-법궤.md (ERD/DB 설계) | statute-율법/02/data-ark-법궤-template.md |
| ③ | api-gate-성문.md (API 명세) | statute-율법/02/api-gate-성문-template.md |

산출물은 `bible-성경/02.architecture-foundation-기초/`에 생성하라.
⚠️ 이 단계에서 fruit-열매/ 소스코드를 생성하지 마라.
```

## ⚔️ 마귀 경고

| 마귀의 속삭임 | 전신갑주 대응 |
|:--|:--|
| "최신 기술 다 넣자" | 🛡️ 의의 흉배: Spec에 필요한 것만 취하라 |
| "설계 건너뛰고 바로 코딩하자" | 👟 평안의 신발: 기초 없이 성전을 세우면 무너진다 |
| "DB 설계는 대충 해도 돼" | 📐 진리의 허리띠: 법궤가 부실하면 성전이 무너진다 |

## 📦 산출물 (Output)

| 파일명 | 저장 경로 |
|:--|:--|
| `architecture-temple-성전설계.md` | `bible-성경/02.architecture-foundation-기초/` |
| `data-ark-법궤.md` | `bible-성경/02.architecture-foundation-기초/` |
| `api-gate-성문.md` | `bible-성경/02.architecture-foundation-기초/` |

## 🔍 심판 관문
> 추가 심판: ERD의 테이블이 Phase 1 요구사항의 데이터 항목을 전부 수용하는가?

## ➡️ 다음 단계
→ `SKILL-03_order-질서.md`
