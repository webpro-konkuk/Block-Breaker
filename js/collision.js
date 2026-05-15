function hitCircleRect(circle, rect) {
  let closeX = circle.x;
  let closeY = circle.y;

  if (closeX < rect.x) {
    closeX = rect.x;
  }
  if (closeX > rect.x + rect.width) {
    closeX = rect.x + rect.width;
  }
  if (closeY < rect.y) {
    closeY = rect.y;
  }
  if (closeY > rect.y + rect.height) {
    closeY = rect.y + rect.height;
  }

  const diffX = circle.x - closeX;
  const diffY = circle.y - closeY;
  const distance = diffX * diffX + diffY * diffY;

  return distance <= circle.radius * circle.radius;
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
  if (!hitCircleRect(ball, paddle)) {
    return false;
  }

  const paddleCenter = paddle.x + paddle.width / 2;
  let hitPoint = (ball.x - paddleCenter) / (paddle.width / 2);

  if (hitPoint < -1) {
    hitPoint = -1;
  }
  if (hitPoint > 1) {
    hitPoint = 1;
  }

  const speed = Math.hypot(ball.vx, ball.vy);
  const angle = hitPoint * (Math.PI / 3);

  if (ball.x < paddle.x) {
    ball.x = paddle.x;
  }
  if (ball.x > paddle.x + paddle.width) {
    ball.x = paddle.x + paddle.width;
  }

  ball.vx = Math.sin(angle) * speed;
  ball.vy = -Math.abs(Math.cos(angle) * speed);
  ball.y = paddle.y - ball.radius - 1;
  return true;
}

function resolveBrickCollision(ball, bricks) {
  for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i];
    if (!brick.alive || !hitCircleRect(ball, brick)) {
      continue;
    }

    const brickCenterX = brick.x + brick.width / 2;
    const brickCenterY = brick.y + brick.height / 2;

    const distanceX = ball.x - brickCenterX;
    const distanceY = ball.y - brickCenterY;

    const overlapX = brick.width / 2 + ball.radius - Math.abs(distanceX);
    const overlapY = brick.height / 2 + ball.radius - Math.abs(distanceY);

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
