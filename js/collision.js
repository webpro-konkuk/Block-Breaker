(function () {
  function hitCircleRect(ball, rect) {
    const cx = Math.max(rect.x, Math.min(ball.x, rect.x + rect.width));
    const cy = Math.max(rect.y, Math.min(ball.y, rect.y + rect.height));
    const dx = cx - ball.x;
    const dy = cy - ball.y;
    return dx * dx + dy * dy <= ball.radius * ball.radius;
  }

  function resolveWallCollision(ball, width, height) {
    if (ball.x - ball.radius <= 0) {
      ball.x = ball.radius;
      ball.vx = Math.abs(ball.vx);
    }

    if (ball.x + ball.radius >= width) {
      ball.x = width - ball.radius;
      ball.vx = -Math.abs(ball.vx);
    }

    if (ball.y - ball.radius <= 0) {
      ball.y = ball.radius;
      ball.vy = Math.abs(ball.vy);
    }

    if (ball.y - ball.radius > height) {
      return false;
    }

    return true;
  }

  function resolvePaddleCollision(ball, paddle) {
    if (!hitCircleRect(ball, paddle)) return false;

    const center = paddle.x + paddle.width / 2;
    const ratio = (ball.x - center) / (paddle.width / 2);
    const clamped = Math.max(-1, Math.min(1, ratio));
    const speed = Math.hypot(ball.vx, ball.vy);
    const angle = clamped * (Math.PI / 3);

    ball.x = Math.min(Math.max(ball.x, paddle.x), paddle.x + paddle.width);
    ball.vx = Math.sin(angle) * speed;
    ball.vy = -Math.abs(Math.cos(angle) * speed);
    ball.y = paddle.y - ball.radius - 1;
    return true;
  }

  function resolveBrickCollision(ball, bricks) {
    for (let i = 0; i < bricks.length; i += 1) {
      const brick = bricks[i];
      if (!brick.alive || !hitCircleRect(ball, brick)) continue;

      const cx = brick.x + brick.width / 2;
      const cy = brick.y + brick.height / 2;
      const dx = ball.x - cx;
      const dy = ball.y - cy;
      const overlapX = brick.width / 2 + ball.radius - Math.abs(dx);
      const overlapY = brick.height / 2 + ball.radius - Math.abs(dy);

      if (overlapX < overlapY) {
        ball.vx = -ball.vx;
      } else {
        ball.vy = -ball.vy;
      }

      brick.alive = false;
      return { points: Math.max(25, brick.points) };
    }

    return null;
  }

  window.resolveWallCollision = resolveWallCollision;
  window.resolvePaddleCollision = resolvePaddleCollision;
  window.resolveBrickCollision = resolveBrickCollision;
})();
