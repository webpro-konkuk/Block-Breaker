(function () {
  function createBall(canvasWidth, canvasHeight) {
    const ball = {
      x: canvasWidth / 2,
      y: canvasHeight - 90,
      radius: 9,
      vx: 4.5,
      vy: -4.5,
      speed: 4.5,
      color: '#ffd166',
    };

    ball.reset = (paddle) => {
      ball.x = paddle.x + paddle.width / 2;
      ball.y = paddle.y - ball.radius - 1;
      const dir = Math.random() < 0.5 ? -1 : 1;
      ball.vx = dir * ball.speed;
      ball.vy = -ball.speed;
    };

    ball.harden = (multiplier) => {
      const total = Math.hypot(ball.vx, ball.vy) * multiplier;
      const ratio = total / Math.hypot(ball.vx, ball.vy);
      ball.vx *= ratio;
      ball.vy *= ratio;
    };

    ball.move = () => {
      ball.x += ball.vx;
      ball.y += ball.vy;
    };

    ball.draw = (ctx) => {
      ctx.fillStyle = ball.color;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
    };

    return ball;
  }

  window.createBall = createBall;
})();
