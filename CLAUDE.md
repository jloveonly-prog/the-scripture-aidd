# CLAUDE.md

이 파일은 Claude Code가 이 디렉토리에서 작업할 때 항상 따라야 하는 규칙을 담습니다.

## Backup 폴더 정책 (생태계 공통 규칙)

- `backup/` 폴더 및 그 하위의 모든 파일/폴더는 **git으로 절대 커밋하지 않는다.**
  - `.gitignore`에 `**/backup/` 규칙이 있는지 먼저 확인하고 없으면 추가한다.
- `backup/` 하위 내용은 **어떤 공개 채널에도 절대 노출하지 않는다.**
- 공개하고 싶은 문서는 애초에 `backup/`에 두지 않는다.
- 이 정책은 `D:\00.TheScriptureMaster` 생태계(00~06, 99) 전체에 공통 적용된다.

## 이 디렉토리 (99.TheScriptureAidd_ko — 개발엔진, KO)

- AIDD 방법론 프레임워크(한글판). `99.TheScriptureAidd`(영문판)와 병행 운영됩니다.
- **주의**: 현재 이 저장소의 git 원격이 영문판과 동일한 URL을 가리키고 있습니다. `the-scripture-aidd-ko`로 별도 원격을 분리하는 작업이 필요합니다.
