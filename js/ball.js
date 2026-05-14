function createBall(canvasWidth, canvasHeight) {
  const ball = {
    x: canvasWidth / 2,
    y: canvasHeight - 90,
    radius: 8,
    vx: 4.5,
    vy: -4.5,
    speed: 4.5,
    color: '#f59e0b',
  };

  ball.reset = (paddle) => {
    ball.x = paddle.x + paddle.width / 2;
    ball.y = paddle.y - ball.radius - 1;
    ball.vx = (Math.random() < 0.5 ? -1 : 1) * ball.speed;
    ball.vy = -ball.speed;
  };

  ball.move = () => {
    ball.x += ball.vx;
    ball.y += ball.vy;
  };

  ball.draw = (ctx) => {
    ctx.beginPath();
    ctx.fillStyle = ball.color;
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  };

  return ball;
}
