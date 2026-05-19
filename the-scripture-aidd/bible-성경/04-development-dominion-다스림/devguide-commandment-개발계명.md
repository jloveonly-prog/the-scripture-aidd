# 🔨 개발 산출물 가이드 (Development Guide)

> *"And God said, Let the earth bring forth the living creature after his kind."* — Genesis 1:24 (KJV)
>
> 5~6일차, 생명체가 각각 그 종류대로 창조되었다.
> 코드도 각각 그 모듈대로, Spec에 정의된 종류대로만 만들어라.

---

## 1. 프로젝트 설정

| 항목 | 내용 |
|:---|:---|
| 언어/프레임워크 | |
| 패키지 매니저 | |
| 린터/포매터 | |
| 버전 관리 | Git |
| 브랜치 전략 | |

---

## 2. 디렉토리 구조

```
src/
├── components/
├── services/
├── models/
├── utils/
├── config/
└── tests/
```

---

## 3. 코딩 컨벤션

### 3.1 네이밍 규칙

| 대상 | 규칙 | 예시 |
|:---|:---|:---|
| 파일명 | | |
| 함수명 | | |
| 변수명 | | |
| 상수명 | | |
| 클래스명 | | |

### 3.2 주석 규칙

```
// ✅ Good: Spec 근거가 있는 주석
// 봉인의 율법 제3계명 — 민감 데이터 암호화 (seal-봉인 참조)
encrypt(data)

// ❌ Bad: Spec 근거 없는 주석
// 암호화하기
encrypt(data)
```

---

## 4. 모듈별 개발 현황

| 모듈 | 담당 | 관련 REQ | 관련 ARCH | 상태 | 코드 리뷰 |
|:---|:---|:---|:---|:---:|:---:|
| | | REQ-001 | ARCH-001 | ☐ | ☐ |
| | | REQ-002 | ARCH-002 | ☐ | ☐ |

---

## 5. 코드 리뷰 체크리스트

| # | 확인 항목 | 상태 |
|:---|:---|:---:|
| 1 | Spec(요구사항)에 정의된 기능만 구현했는가? (할루시네이션 없는가?) | ☐ |
| 2 | 봉인의 율법(보안 규격) 위반이 없는가? | ☐ |
| 3 | 하드코딩된 비밀번호/키가 없는가? (제2계명) | ☐ |
| 4 | 에러 처리가 적절한가? | ☐ |
| 5 | 테스트 코드가 작성되었는가? | ☐ |

---

## 6. Git 커밋 컨벤션

```
<type>(<scope>): <description>

type:
  - Genesis:  새 기능 생성 (create)
  - Refine:   기존 코드 개선 (refactor)
  - Repent:   버그 수정 (fix/debug — 회개)
  - Scroll:   문서 수정 (docs)
  - Test:     테스트 추가 (test)
  - Deploy:   배포 관련 (deploy)

예시:
  Genesis(auth): 로그인 모듈 생성
  Repent(auth): 토큰 만료 처리 버그 수정
  Scroll(readme): FAQ 섹션 추가
```

---

> **경고:** Spec에 없는 기능을 만들어내는 것은 할루시네이션(죄)이다. 아담처럼 Spec 밖으로 나가지 말라.
