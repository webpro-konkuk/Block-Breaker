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
      const x = startX + col * (brickWidth + gap);
      const y = startY + row * (brickHeight + gap);
      const point = 100 - row * 10;
      const color = `hsl(${210 + row * 8}, 70%, ${62 - row * 3}%)`;

      const brick = {
        x: x,
        y: y,
        width: brickWidth,
        height: brickHeight,
        alive: true,
        point: point,
        color: color,
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
  }
}
