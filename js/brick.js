/**
 * 벽돌 공통 인터페이스 계약
 * row: number
 * col: number
 * x: number
 * y: number
 * width: number
 * height: number
 * alive: boolean
 * tag: 'div'|'span'|'hr'|'br'|'a'|'img'|'h1'|'ul'|'strong'|'li'
 * hp: number
 * point: number
 * color: string
 * effect: null | {
 *   kind: 'backgroundImage'|'ballGrow'|'clearTag'|'rowDamage'|'dropRow'|'respawnRandom',
 *   amount?: number,
 *   targetTag?: string
 * }
 */

const BRICK_PROFILE = {
  div:   { hp: 2, point: 70,  color: '#3b82f6', effect: null },
  span:  { hp: 1, point: 20,  color: '#a5f3fc', effect: null },
  hr:    { hp: 1, point: 30,  color: '#fb923c', effect: { kind: 'rowDamage', amount: 1 } },
  br:    { hp: 1, point: 25,  color: '#4ade80', effect: { kind: 'dropRow' } },
  a:     { hp: 1, point: 80,  color: '#818cf8', effect: { kind: 'respawnRandom' } },
  img:   { hp: 1, point: 100, color: '#0ea5e9', effect: { kind: 'backgroundImage' } },
  h1:    { hp: 1, point: 220, color: '#f97316', effect: null },
  ul:    { hp: 1, point: 110, color: '#34d399', effect: { kind: 'clearTag', targetTag: 'li' } },
  strong:{ hp: 1, point: 140, color: '#f43f5e', effect: { kind: 'ballGrow', amount: 2 } },
  li:    { hp: 1, point: 15,  color: '#facc15', effect: null },
};

const BRICK_LAYOUT = [
  ['div', 'span', 'img', 'span', 'div', 'span', 'div', 'li'],      // row 0
  ['div', 'hr',  'div', 'strong', 'div', 'span', 'div', 'div'],    // row 1
  ['div', 'div', 'ul',  'li',   'li', 'div',  'span', 'div'],      // row 2
  ['div', 'span', 'a', 'div', 'h1', 'div', 'br', 'span'],          // row 3
  // row 4 ... level이 늘면 반복/패턴 확장 가능
];

function getTagByPosition(row, col) {
  return BRICK_LAYOUT[row] && BRICK_LAYOUT[row][col] ? BRICK_LAYOUT[row][col] : 'div';
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
        row, 
        col,
        x: startX + col * (brickWidth + gap),
        y: startY + row * (brickHeight + gap),
        width: brickWidth,
        height: brickHeight,
        alive: true,

        tag,
        hp: profile.hp,
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
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(brick.tag, brick.x + brick.width / 2, brick.y + brick.height / 2);
  }
}
