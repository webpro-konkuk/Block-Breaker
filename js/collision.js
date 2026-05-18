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

// 벽돌 하나의 체력을 1 줄이고, 체력이 0이면 깨진 것으로 처리합니다.
function damageBrick(brick) {
  if (!brick.alive) {
    return 0;
  }

  brick.hp -= 1;

  if (brick.hp <= 0) {
    brick.alive = false;
    return brick.point;
  }

  return 0;
}

// <hr> 벽돌 효과: 같은 줄에 있는 벽돌들의 체력을 1씩 줄입니다.
function damageSameRow(bricks, row) {
  let point = 0;

  for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i];
    if (!brick.alive || brick.row !== row) {
      continue;
    }

    point += damageBrick(brick);
  }

  return point;
}

// <br> 벽돌 효과: 살아있는 모든 벽돌을 한 줄 아래로 내립니다.
function moveBricksDown(bricks) {
  for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i];
    if (!brick.alive) {
      continue;
    }

    brick.row += 1;
    brick.y += brick.height + 8;
  }
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

    let point = 0;

    // 태그 타입에 따라 충돌 효과를 다르게 적용합니다.
    if (brick.type === 'hr') {
      point += damageSameRow(bricks, brick.row);
    } else {
      point += damageBrick(brick);
    }

    if (brick.type === 'br') {
      // <br>은 자기 자신이 깨진 뒤 전체 블록을 아래로 내리는 특수 효과입니다.
      moveBricksDown(bricks);
    }

    return point;
  }

  return 0;
}
