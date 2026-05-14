function hitCircleRect(circle, rect) {
  const px = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
  const py = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
  const dx = px - circle.x;
  const dy = py - circle.y;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
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

  return ball.y - ball.radius <= height;
}

function resolvePaddleCollision(ball, paddle) {
  if (!hitCircleRect(ball, paddle)) {
    return false;
  }

  const center = paddle.x + paddle.width / 2;
  const ratio = (ball.x - center) / (paddle.width / 2);
  const percent = Math.max(-1, Math.min(1, ratio));
  const speed = Math.hypot(ball.vx, ball.vy);
  const angle = percent * (Math.PI / 3);

  ball.x = Math.min(Math.max(ball.x, paddle.x), paddle.x + paddle.width);
  ball.vx = Math.sin(angle) * speed;
  ball.vy = -Math.abs(Math.cos(angle) * speed);
  ball.y = paddle.y - ball.radius - 1;
  return true;
}

function resolveBrickCollision(ball, bricks) {
  for (let i = 0; i < bricks.length; i += 1) {
    const brick = bricks[i];
    if (!brick.alive || !hitCircleRect(ball, brick)) {
      continue;
    }

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
    return brick.point;
  }

  return 0;
}
