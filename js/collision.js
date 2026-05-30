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

function pushBallOutOfBrick(ball, brick, overlapX, overlapY, dx, dy, bounds, forceAxis) {
  const cx = brick.x + brick.width / 2;
  const cy = brick.y + brick.height / 2;
  const buffer = 0.5;

  if (forceAxis === 'x' || (!forceAxis && overlapX < overlapY)) {
    let side = Math.sign(dx || -ball.vx || 1);
    let nextX = cx + side * (brick.width / 2 + ball.radius + buffer);

    if (bounds && (nextX - ball.radius < 0 || nextX + ball.radius > bounds.width)) {
      side *= -1;
      nextX = cx + side * (brick.width / 2 + ball.radius + buffer);
    }

    ball.x = nextX;
    ball.vx = Math.abs(ball.vx) * side;
    return 'x';
  }

  let side = Math.sign(dy || -ball.vy || 1);
  let nextY = cy + side * (brick.height / 2 + ball.radius + buffer);

  if (bounds && (nextY - ball.radius < 0 || nextY + ball.radius > bounds.height)) {
    side *= -1;
    nextY = cy + side * (brick.height / 2 + ball.radius + buffer);
  }

  ball.y = nextY;
  ball.vy = Math.abs(ball.vy) * side;
  return 'y';
}

function findBrickHit(ball, bricks, unbreakableOnly = false) {
  let hit = null;

  for (let i = 0; i < bricks.length; i += 1) {
    const brick = bricks[i];
    if (!brick.alive || (unbreakableOnly && !brick.unbreakable) || !hitCircleRect(ball, brick)) {
      continue;
    }

    const cx = brick.x + brick.width / 2;
    const cy = brick.y + brick.height / 2;
    const dx = ball.x - cx;
    const dy = ball.y - cy;
    const overlapX = brick.width / 2 + ball.radius - Math.abs(dx);
    const overlapY = brick.height / 2 + ball.radius - Math.abs(dy);
    const overlap = Math.min(overlapX, overlapY);

    const shouldUseHit =
      !hit ||
      (brick.unbreakable && !hit.brick.unbreakable) ||
      (brick.unbreakable === hit.brick.unbreakable && overlap < hit.overlap);

    if (shouldUseHit) {
      hit = { brick, overlapX, overlapY, dx, dy, overlap };
    }
  }

  return hit;
}

function resolveBrickCollision(ball, bricks, width, height) {
  const bounds = width && height ? { width, height } : null;
  let hit = findBrickHit(ball, bricks);

  if (!hit) {
    return 0;
  }

  if (hit.brick.unbreakable) {
    for (let i = 0; i < 4 && hit; i += 1) {
      const previous = { x: ball.x, y: ball.y, vx: ball.vx, vy: ball.vy };
      const axis = pushBallOutOfBrick(
        ball,
        hit.brick,
        hit.overlapX,
        hit.overlapY,
        hit.dx,
        hit.dy,
        bounds
      );
      let nextHit = findBrickHit(ball, bricks, true);

      if (nextHit) {
        ball.x = previous.x;
        ball.y = previous.y;
        ball.vx = previous.vx;
        ball.vy = previous.vy;
        pushBallOutOfBrick(
          ball,
          hit.brick,
          hit.overlapX,
          hit.overlapY,
          hit.dx,
          hit.dy,
          bounds,
          axis === 'x' ? 'y' : 'x'
        );
        nextHit = findBrickHit(ball, bricks, true);
      }

      hit = nextHit;
    }
    return 0;
  }

  const { brick, overlapX, overlapY, dx, dy } = hit;
  pushBallOutOfBrick(ball, brick, overlapX, overlapY, dx, dy, bounds);

  if (typeof brick.hp === 'number') {
    brick.hp -= 1;
    if (brick.hp > 0) {
      return 0;
    }
  }
  brick.alive = false;

  if (!brick.effect) {
    return brick.point;
  }

  return {
    score: brick.point,
    tag: brick.tag,
    effect: brick.effect,
    hitBrick: brick,
  };
}
