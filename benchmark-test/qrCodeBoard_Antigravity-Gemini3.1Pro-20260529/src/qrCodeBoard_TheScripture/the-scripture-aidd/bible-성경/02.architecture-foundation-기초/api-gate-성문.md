# 🚪 API 명세서

## 1. API 엔드포인트 목록
| API-ID | Method | URI | 설명 | 연결 REQ |
|:---|:---|:---|:---|:---|
| API-001 | GET | / | 메인 스캔 화면 렌더링 | FR-001, FR-002 |
| API-002 | GET | /board | 게시판 목록 화면 렌더링 | FR-004 |
| API-003 | POST | /api/scan | 스캔 결과 저장 API | FR-003 |

## 2. API 상세 명세

### API-001: 메인 화면 렌더링
- **Method / URI**: GET `/`
- **Request Parameters**: 없음
- **Response**: HTML (메인 페이지)

### API-002: 게시판 화면 렌더링
- **Method / URI**: GET `/board`
- **Request Parameters**: 없음
- **Response**: HTML (게시판 페이지, scans 테이블 데이터 목록 포함)

### API-003: 스캔 결과 저장
- **Method / URI**: POST `/api/scan`
- **Request Body** (application/x-www-form-urlencoded):
  - `content` (string, 필수): 스캔된 내용
- **Response**: HTML (HTMX를 위한 성공 메시지 또는 새로고침 스크립트 반환)
