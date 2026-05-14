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
      const hue = 210 + row * 8;
      const light = 62 - row * 3;
      bricks.push({
        x: startX + col * (brickWidth + gap),
        y: startY + row * (brickHeight + gap),
        width: brickWidth,
        height: brickHeight,
        alive: true,
        point: 100 - row * 10,
        color: `hsl(${hue}, 70%, ${light}%)`,
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
  }
}
