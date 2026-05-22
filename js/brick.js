/**
 * 벽돌 공통 인터페이스
 * row, col: 벽돌의 행/열 위치
 * x, y, width, height: 캔버스 충돌 판정용 위치와 크기
 * alive: 화면에 남아있는지 여부
 * tag: 벽돌이 의미하는 HTML 태그 이름
 * label: 화면에 표시할 태그 문자열
 * hp, maxHp: 현재 체력과 최대 체력
 * point: 깨졌을 때 얻는 점수
 * color: 임시 색상, 최종 디자인은 디자인 담당자가 조정
 * effect: 태그별 특수 효과 정보
 */
const BRICK_PROFILE = {
  div: { hp: 2, point: 70, color: '#3b82f6', effect: null },
  span: { hp: 1, point: 20, color: '#a5f3fc', effect: null },
  hr: { hp: 1, point: 30, color: '#fb923c', effect: { kind: 'rowDamage', amount: 1 } },
  br: { hp: 1, point: 25, color: '#4ade80', effect: { kind: 'dropRow' } },
  a: { hp: 1, point: 80, color: '#818cf8', effect: { kind: 'respawnRandom' } },
  img: { hp: 1, point: 100, color: '#0ea5e9', effect: { kind: 'backgroundImage' } },
  h1: { hp: 1, point: 220, color: '#f97316', effect: null },
  ul: { hp: 1, point: 110, color: '#34d399', effect: { kind: 'clearTag', targetTag: 'li' } },
  strong: { hp: 1, point: 140, color: '#f43f5e', effect: { kind: 'ballGrow', amount: 2 } },
  li: { hp: 1, point: 15, color: '#facc15', effect: null },
};

const BRICK_LAYOUT = [
  ['div', 'span', 'div', 'span', 'div', 'span', 'div', 'span'],
  ['span', 'div', 'hr', 'div', 'span', 'div', 'hr', 'div'],
  ['div', 'span', 'div', 'br', 'div', 'span', 'div', 'br'],
  ['span', 'div', 'span', 'div', 'hr', 'div', 'span', 'div'],
];

function getTagByPosition(row, col) {
  if (BRICK_LAYOUT[row] && BRICK_LAYOUT[row][col]) {
    return BRICK_LAYOUT[row][col];
  }

  return row % 2 === 0 ? 'div' : 'span';
}

function createBrickGrid(level, canvasWidth) {
  const cols = 8;
  const rows = Math.min(2 + level, 7);
  const gap = 8;
  const startX = 24;
  const startY = 54;
  const brickWidth = (canvasWidth - startX * 2 - gap * (cols - 1)) / cols;
  const brickHeight = 20;

  const bricks = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const tag = getTagByPosition(row, col);
      const profile = BRICK_PROFILE[tag];

      bricks.push({
        row: row,
        col: col,
        x: startX + col * (brickWidth + gap),
        y: startY + row * (brickHeight + gap),
        width: brickWidth,
        height: brickHeight,
        alive: true,
        tag: tag,
        label: '<' + tag + '>',
        hp: profile.hp,
        maxHp: profile.hp,
        point: profile.point,
        color: profile.color,
        effect: profile.effect,
      });
    }
  }

  return bricks;
}

function drawBricks(ctx, bricks) {
  for (let i = 0; i < bricks.length; i += 1) {
    const brick = bricks[i];
    if (!brick.alive) {
      continue;
    }
    ctx.fillStyle = brick.color;
    ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(brick.label, brick.x + brick.width / 2, brick.y + brick.height / 2);

    if (brick.maxHp > 1) {
      ctx.font = '10px Arial';
      ctx.fillText(brick.hp + '/' + brick.maxHp, brick.x + brick.width - 16, brick.y + 10);
    }
  }
}
