# 🧱 태스크 성벽 (Task Wall)

## 1. 기능별 Task 분리
| TASK-ID | 설명 | 연결 REQ | 생성 파일 | 파일의 단일 책임 | 예상 줄 수 |
|:---|:---|:---|:---|:---|:---|
| TASK-001 | 프로젝트 초기화 | NFR-001 | `package.json`, `tsconfig.json` | 패키지 및 타입스크립트 설정 | 50줄 |
| TASK-002 | DB 스키마 생성 | FR-003 | `src/db.ts` | SQLite 테이블 생성 및 쿼리 | 100줄 |
| TASK-003 | 애플리케이션 진입점 및 라우팅 | FR-001, FR-002 | `src/index.tsx` | Hono 앱 초기화 및 라우팅, 통합 렌더링 | 250줄 |

## 2. 의존성 맵
- TASK-001 → TASK-002 → TASK-003
