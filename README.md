# Block-Breaker 팀 협업 가이드

## 프로젝트 개요
이 프로젝트는 **역할 분담 기반으로 충돌을 줄이고 병행 작업이 쉬운 벽돌깨기 게임 구조**를 위한 예제입니다.

- 팀원: 4명
- 목표: 기능별로 파일을 분리해 충돌을 줄이고 각자 담당 영역을 명확히 하는 것
- 구현 파일: `index.html`, `css/style.css`, `js/main.js`, `js/ball.js`, `js/paddle.js`, `js/brick.js`, `js/collision.js`, `js/ui.js`

---

## 팀 배정(고정)

- **조영기**: 게임판 / 전체 구조
  - 담당 파일: `index.html`, `js/main.js`
- **김유담**: 공 + 패들
  - 담당 파일: `js/ball.js`, `js/paddle.js`
- **신동혁**: 벽돌, 충돌 처리
  - 담당 파일: `js/brick.js`, `js/collision.js`
- **김동호**: 디자인
  - 담당 파일: `js/ui.js`, `css/style.css`

---

## 폴더 구조

```bash
Block-Breaker/
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    ├── main.js
    ├── ball.js
    ├── paddle.js
    ├── brick.js
    ├── collision.js
    └── ui.js
```

---

## 파일 역할 정리

### 1) `index.html` (게임판/진입점) — 담당: 조영기
- 게임 화면 레이아웃 구성
- 점수/생명/레벨/상태 메시지 영역 배치
- 시작/일시정지/재시작 버튼 배치
- JS 파일 로드 순서 관리

### 2) `css/style.css` (시각 스타일) — 담당: 김동호
- 전체 UI 색상/간격/폰트/반응형 규칙 정의
- 버튼, HUD, 캔버스, 오버레이 메시지 스타일 정의

### 3) `js/main.js` (게임 전체 제어) — 담당: 조영기
- 게임 상태(state) 관리: `ready`, `running`, `paused`, `gameOver`, `clear`
- 메인 루프(`requestAnimationFrame`) 제어
- 점수/생명/레벨 흐름 및 레벨업 처리
- `ball`, `paddle`, `brick`, `collision`, `ui`와 같은 하위 모듈 호출 및 조합

### 4) `js/ball.js` (공 로직) — 담당: 김유담
- 공 생성 및 초기값 설정
- 공 이동(`move`), 리셋(`reset`), 그리기(`draw`)
- 공 속도/방향 변경의 기본 로직

### 5) `js/paddle.js` (패들 + 키 입력) — 담당: 김유담
- 패들 생성/이동/그리기/리셋
- 키보드 입력 처리(`ArrowLeft`, `ArrowRight`, `A`, `D`)
- 패들의 좌우 경계 처리

### 6) `js/brick.js` (벽돌 데이터) — 담당: 신동혁
- 레벨 기반 벽돌 배열 생성(`createBrickGrid`)
- 벽돌 색/위치/점수 정보 관리
- 벽돌 렌더링(`drawBricks`)

### 7) `js/collision.js` (충돌 처리) — 담당: 신동혁
- 공-벽돌 충돌 감지 및 반사 처리
- 공-패들 충돌 감지 및 반사 방향 계산
- 공-벽면 충돌 및 바닥 이탈 처리

### 8) `js/ui.js` (HUD/메시지) — 담당: 김동호
- 점수/생명/레벨 텍스트 업데이트
- 게임 상태 메시지 표시
- 중앙 오버레이 텍스트(일시정지/클리어/게임오버 등) 렌더링

---

## 실행 방법

1. `index.html` 열기
2. 시작 버튼 클릭
3. 좌/우 방향키 또는 `A`, `D`로 패들 조작
4. 벽돌을 다 깨면 레벨업, 생명 소진 시 GAME OVER

---

## 비고

현재 프로젝트는 파일 기반 로드 방식이므로 `file://`로 실행해도 동작합니다.
(팀이 익숙해지면 추후 ES 모듈 방식으로 리팩터링 가능합니다.)
