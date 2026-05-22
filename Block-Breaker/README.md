# Block-Breaker (수업 과제 버전)

이 버전은 웹프로그래밍 `canvas` 수업에서 쓰던 스타일에 맞춰 정리했습니다.
- 전역 상태 기반(`gameState`)
- `init / draw / update / loop` 구조
- `window.load` 후 게임 시작

---

## 팀원 역할 (고정)

- 조영기: `index.html`, `js/main.js`
- 김유담: `js/ball.js`, `js/paddle.js`
- 신동혁: `js/brick.js`, `js/collision.js`
- 김동호: `js/ui.js`, `css/style.css`

---

## 파일별 역할

### index.html
- 캔버스, 버튼, 점수 HUD를 배치
- JS 파일 로드 순서 관리

### css/style.css
- 기본 레이아웃/색상/반응형 스타일

### js/main.js
- 게임 전체 상태와 진행 상태 관리
- `시작`, `일시정지`, `재시작` 버튼 동작
- `draw` / `update` / `loop` 흐름

### js/ball.js
- 공 객체 상태 생성
- 공의 초기 위치, 이동, 초기화, 그리기

### js/paddle.js
- 패들 객체 생성
- 좌우 이동 처리
- 키보드 입력 상태(`A/D`, `←/→`) 처리

### js/brick.js
- 레벨별 벽돌 배열 생성
- 벽돌 렌더링

### js/collision.js
- 공-벽면, 공-패들, 공-벽돌 충돌 처리
- 충돌 시 방향 반전/점수 계산

### js/ui.js
- 점수/생명/레벨 표시
- 상태 메시지 표시
- 일시정지/게임오버/클리어 중앙 문구 출력

---

## 실행 방법

1. `Block-Breaker/index.html` 열기
2. 시작 버튼 클릭
3. 좌/우 화살표 또는 A/D로 패들 이동
4. 벽돌을 다 깨면 레벨업, 생명 소진 시 게임 오버

---

## 과제 제출용 점검 체크리스트

- `index.html`을 열어 바로 실행되는가?
- 시작 / 일시정지 / 재시작이 동작하는가?
- 점수와 생명이 화면에 바로 반영되는가?
- 벽돌 삭제와 레벨 증가가 정상인지 확인
