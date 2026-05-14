(function () {
  function createBrickGrid(level, canvasWidth) {
    const cols = 8;
    const rows = Math.min(2 + level, 7);
    const gap = 10;
    const left = 48;
    const top = 64;
    const width = (canvasWidth - left * 2 - gap * (cols - 1)) / cols;
    const height = 22;
    const grid = [];

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const hue = 210 + row * 8;
        const light = 58 - row * 3;
        grid.push({
          x: left + col * (width + gap),
          y: top + row * (height + gap),
          width,
          height,
          alive: true,
          points: 100 - row * 10,
          color: `hsl(${hue}, 70%, ${light}%)`,
        });
      }
    }

    return grid;
  }

  function drawBricks(ctx, bricks) {
    for (const brick of bricks) {
      if (!brick.alive) continue;
      ctx.fillStyle = brick.color;
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
    }
  }

  window.createBrickGrid = createBrickGrid;
  window.drawBricks = drawBricks;
})();
