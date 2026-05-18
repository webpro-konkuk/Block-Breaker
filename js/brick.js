// 태그별 벽돌 기본 정보입니다.
// 디자인은 나중에 바꿀 수 있고, 여기서는 체력과 점수 같은 게임 로직 값을 관리합니다.
const BRICK_TAGS = {
  div: {
    text: '<div>',
    hp: 2,
    point: 100,
    color: '#2563eb',
  },
  span: {
    text: '<span>',
    hp: 1,
    point: 40,
    color: '#38bdf8',
  },
  hr: {
    text: '<hr>',
    hp: 1,
    point: 70,
    color: '#f97316',
  },
  br: {
    text: '<br>',
    hp: 1,
    point: 60,
    color: '#22c55e',
  },
};

// 레벨마다 어떤 태그 벽돌을 배치할지 정합니다.
function getBrickType(level, row, col) {
  const levelTypes = [
    ['div', 'span', 'span', 'div', 'span', 'span', 'div', 'span'],
    ['div', 'span', 'hr', 'span', 'div', 'span', 'hr', 'span'],
    ['div', 'br', 'span', 'hr', 'div', 'span', 'br', 'span'],
  ];

  let patternIndex = level - 1;
  if (patternIndex >= levelTypes.length) {
    patternIndex = levelTypes.length - 1;
  }

  const pattern = levelTypes[patternIndex];
  return pattern[(row + col) % pattern.length];
}

function createBrickGrid(level, canvasWidth) {
  const colCount = 8;
  let rowCount = 2 + level;
  if (rowCount > 7) {
    rowCount = 7;
  }

  const gap = 8;
  const startX = 24;
  const startY = 54;
  const brickHeight = 20;
  const brickWidth = (canvasWidth - startX * 2 - gap * (colCount - 1)) / colCount;
  const bricks = [];

  for (let row = 0; row < rowCount; row ++) {
    for (let col = 0; col < colCount; col ++) {
      // 기존 일반 벽돌 대신 태그 타입을 가진 벽돌을 만듭니다.
      const type = getBrickType(level, row, col);
      const tagInfo = BRICK_TAGS[type];

      const x = startX + col * (brickWidth + gap);
      const y = startY + row * (brickHeight + gap);

      const brick = {
        x: x,
        y: y,
        // row, col은 <hr>처럼 같은 줄 벽돌을 찾을 때 사용합니다.
        row: row,
        col: col,
        width: brickWidth,
        height: brickHeight,
        alive: true,
        // type/text/hp/maxHp가 태그형 벽돌 처리를 위해 추가된 값입니다.
        type: type,
        text: tagInfo.text,
        hp: tagInfo.hp,
        maxHp: tagInfo.hp,
        point: tagInfo.point,
        color: tagInfo.color,
      };

      bricks.push(brick);
    }
  }

  return bricks;
}

function drawBricks(ctx, bricks) {
  for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i];

    if (!brick.alive) {
      continue;
    }

    ctx.fillStyle = brick.color;
    ctx.fillRect(brick.x, brick.y, brick.width, brick.height);

    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);

    // 벽돌 안에 <div>, <span> 같은 태그 이름을 표시합니다.
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(brick.text, brick.x + brick.width / 2, brick.y + brick.height / 2);

    if (brick.maxHp > 1) {
      // 체력이 2 이상인 벽돌은 남은 체력을 같이 보여줍니다.
      ctx.font = '10px Arial';
      ctx.fillText(brick.hp + '/' + brick.maxHp, brick.x + brick.width - 16, brick.y + 10);
    }
  }
}
