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
  bedrock: { hp: 1, point: 0, color: '#050505', effect: null, unbreakable: true },
};

const BRICK_LAYOUTS = {
  1: [
    ['span', 'div', 'span', 'img', 'span', 'div', 'span', 'li'],
    ['div', 'hr', 'div', 'strong', 'div', 'br', 'div', 'span'],
    ['span', 'div', 'ul', 'li', 'li', 'a', 'div', 'span'],
  ],
  2: [
    ['div', 'span', 'bedrock', 'img', 'img', 'bedrock', 'span', 'div'],
    ['span', 'hr', 'div', 'strong', 'div', 'br', 'a', 'span'],
    ['div', 'bedrock', 'ul', 'li', 'li', 'ul', 'bedrock', 'div'],
    ['span', 'div', 'div', 'hr', 'br', 'div', 'div', 'span'],
  ],
  3: [
    ['bedrock', 'div', 'span', 'img', 'img', 'span', 'div', 'bedrock'],
    ['div', 'bedrock', 'hr', 'strong', 'strong', 'br', 'bedrock', 'div'],
    ['span', 'div', 'bedrock', 'ul', 'a', 'bedrock', 'div', 'span'],
    ['div', 'hr', 'li', 'li', 'li', 'li', 'br', 'div'],
    ['bedrock', 'div', 'span', 'bedrock', 'bedrock', 'span', 'div', 'bedrock'],
  ],
};

function getLayoutByLevel(level) {
  return BRICK_LAYOUTS[level] || BRICK_LAYOUTS[1];
}

function createBrickGrid(level, canvasWidth) {
  const layout = getLayoutByLevel(level);
  const rows = layout.length;
  const cols = layout[0].length;
  const gap = 8;
  const startX = 24;
  const startY = 54;
  const brickWidth = (canvasWidth - startX * 2 - gap * (cols - 1)) / cols;
  const brickHeight = 20;
  const bricks = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const tag = layout[row][col] || 'div';
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
        label: '<' + tag + '>',
        hp: profile.hp,
        maxHp: profile.hp,
        point: profile.point,
        color: profile.color,
        effect: profile.effect,
        unbreakable: profile.unbreakable || false,
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

    if (brick.maxHp > 1 && !brick.unbreakable) {
      ctx.font = '10px Arial';
      ctx.fillText(brick.hp + '/' + brick.maxHp, brick.x + brick.width - 16, brick.y + 10);
    }
  }
}
