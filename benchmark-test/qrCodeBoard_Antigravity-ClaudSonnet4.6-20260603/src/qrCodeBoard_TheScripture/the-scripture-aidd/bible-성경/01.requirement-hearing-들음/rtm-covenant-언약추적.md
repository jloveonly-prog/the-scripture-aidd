# 📜 요구사항 추적 매트릭스(RTM) — QR코드 게시판 (The Scripture)

> **bible-성경/01.requirement-hearing-들음/rtm-covenant-언약추적.md**
> 모든 언약(Covenant)은 기록되어야 한다. — Exodus 17:14

---

## 추적 매트릭스 본문

| REQ-ID | 요구사항 요약 | UC-ID | ARCH-ID | API-ID | TBL-ID | 코드 모듈 | 테스트 ID | 상태 |
|:---|:---|:---|:---|:---|:---|:---|:---|:---:|
| REQ-001 | QR 코드 카메라 스캔 | UC-002 | ARCH-003 | API-001 | — | views/home/index.tsx | TC-HTTP-001 | ✅ |
| REQ-002 | 스캔 결과 화면 표시 | UC-002 | ARCH-003 | API-001 | — | views/home/index.tsx | TC-HTTP-001 | ✅ |
| REQ-003 | 홈페이지 메인 화면 | UC-001 | ARCH-001, ARCH-005 | API-001 | — | routes/home.tsx | TC-HTTP-001 | ✅ |
| REQ-004 | 게시판 글 목록 조회 | UC-003 | ARCH-002, ARCH-004 | API-002 | TBL-001 | routes/board.tsx | TC-HTTP-002 | ✅ |
| REQ-005 | 게시판 글 작성 | UC-005 | ARCH-002, ARCH-004 | API-003, API-004 | TBL-001 | routes/board.tsx | TC-HTTP-004 | ✅ |
| REQ-006 | 게시판 글 상세 조회 | UC-004 | ARCH-002, ARCH-004 | API-005 | TBL-001 | routes/board.tsx | TC-HTTP-009 | ✅ |

---

## 커버리지 요약

| 지표 | 수치 |
|:---|:---:|
| 전체 REQ 수 | 6 |
| 완전 추적(✅) | 6 |
| 부분 추적(🔄) | 0 |
| 미추적(⬜) | 0 |
| 커버리지 | **100%** |

---

## 언약추적 갱신 이력

| 시점 | 갱신 내용 |
|:---|:---|
| Phase 1 완료 (2026-06-03) | REQ 열 전체 등재. UC 연결 완료. |
| Phase 2 완료 (2026-06-03) | ARCH-ID, API-ID, TBL-ID 등재 완료 |
| Phase 4~7 완료 (2026-06-03) | 코드 모듈, 테스트 ID, 상태 ✅ 전부 등재 — 커버리지 100% |

