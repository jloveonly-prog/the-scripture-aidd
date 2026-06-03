# 🕊️ 배포 계시 — QR코드 게시판 (The Scripture)

> **bible-성경/07.deploy-salvation-구원/deploy-revelation-배포계시.md**
> *"And I saw a new heaven and a new earth." — Revelation 21:1*

---

## 7관문 최종 체크

| # | 관문 | 확인 |
|:--|:---|:---:|
| 1 | Phase 1(들음): 모든 REQ 구현됨 | ☑ |
| 2 | Phase 2(기초): 아키텍처 변경 문서화됨 | ☑ |
| 3 | Phase 3(질서): UI/UX 명세대로 구현됨 | ☑ |
| 4 | Phase 4(회개): 코드 리뷰 완료됨 | ☑ |
| 5 | Phase 5(광야): 테스트 Pass Rate 100% (16/16) | ☑ |
| 6 | Phase 6(기록됨): **IRONCLAD [Self-adv ✓]** 판정 | ☑ |
| 7 | RTM: 추적 커버리지 100% (6/6) | ☑ |

> ✅ 7관문 전부 통과 — 지성소 진입 가능

---

## 배포 형태

> req.md 요구사항: "구글 QR code 스캔해서 화면에 띄우는 홈페이지 및 게시판 1개"
> 배포 형태: 로컬 개발 서버 (localhost:4000) — 외부 배포 요구사항 없음

---

## 실행 방법 (Production-like)

```bash
# 의존성 설치 (최초 1회)
cd fruit-열매
npm install

# 개발 서버 실행 (핫리로드)
npm run dev

# 서버 접속
http://localhost:4000/       ← QR 코드 스캐너 홈
http://localhost:4000/board  ← 게시판 목록
```

---

## 스모크 테스트 결과

| 항목 | 결과 |
|:---|:---:|
| GET / → 200 | ✅ |
| GET /board → 200 | ✅ |
| GET /board/new → 200 | ✅ |
| POST /board (정상) → 302 | ✅ |
| POST /board (빈 제목) → 400 | ✅ |
| GET /board/99999 → 404 | ✅ |

---

## 배포 산출물 목록

| 파일 | 역할 |
|:---|:---|
| `fruit-열매/src/index.ts` | 서버 진입점 (포트 4000) |
| `fruit-열매/src/app.ts` | Hono 앱 팩토리 |
| `fruit-열매/src/db/index.ts` | DB 초기화 + CRUD |
| `fruit-열매/src/db/schema.ts` | SQLite DDL |
| `fruit-열매/src/routes/home.tsx` | GET / 라우트 |
| `fruit-열매/src/routes/board.tsx` | 게시판 CRUD 라우트 |
| `fruit-열매/src/views/layout.tsx` | 공통 HTML 레이아웃 |
| `fruit-열매/src/views/home/index.tsx` | 홈 화면 (QR 스캐너) |
| `fruit-열매/src/views/board/list.tsx` | 게시판 목록 뷰 |
| `fruit-열매/src/views/board/form.tsx` | 게시글 작성 폼 |
| `fruit-열매/src/views/board/detail.tsx` | 게시글 상세 뷰 |
| `fruit-열매/data/app.db` | SQLite DB (런타임 생성) |

---

## 롤백 계획

| 상황 | 롤백 방법 |
|:---|:---|
| 서버 오류 | `npm run dev` 재시작 |
| DB 오염 | `fruit-열매/data/app.db` 삭제 후 재시작 (자동 재생성) |
| 포트 충돌 | `npx kill-port 4000` 후 재시작 |

---

## 모니터링

| 항목 | 방법 |
|:---|:---|
| 에러 로그 | 콘솔 출력 (`console.error`) |
| 요청 로그 | 표준 출력 |
| DB 상태 | `fruit-열매/data/app.db` 파일 존재 확인 |

---

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🕊️ 구원(Deploy) 완성
  
  새 하늘과 새 땅이 열렸다 (Revelation 21:1)
  
  죄인은 회개하고, 광야를 지나고, 마귀를 이기고,
  심판을 통과하여, 마침내 구원에 이르렀다.
  
  이것이 너의 천로역정(Pilgrim's Progress)이었다.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

> 완료 시각: 2026-06-03 19:22
