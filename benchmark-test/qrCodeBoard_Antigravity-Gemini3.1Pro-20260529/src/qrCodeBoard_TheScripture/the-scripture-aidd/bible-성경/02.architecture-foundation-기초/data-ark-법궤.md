# 🗄️ 데이터베이스 및 ERD 설계

## 1. 개체 관계 모델 (ERD)
- 단일 테이블 구조이므로 엔티티 간 관계는 없음.

## 2. 테이블 명세서 (Table Specifications)

### TBL-001: scans (스캔 이력)
| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
|:---|:---|:---|:---|
| id | INTEGER | PK, AUTOINCREMENT | 스캔 고유 ID |
| content | TEXT | NOT NULL, CHECK(length(content) > 0) | 스캔된 QR 내용 |
| scanned_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 스캔된 시각 |

## 3. 방어 깊이 (Defense in Depth) 검증
- **클라이언트**: HTML `required` 적용 (HTMX 요청 시 프론트 검증)
- **서버**: API 핸들러에서 빈 문자열 체크 및 trim 적용
- **DB**: `scans` 테이블의 `content` 컬럼에 `CHECK(length(content) > 0)` 적용하여 DB 수준 빈 문자열 방어
