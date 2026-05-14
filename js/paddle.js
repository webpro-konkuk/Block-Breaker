(function () {
  function createPaddle(canvasWidth, canvasHeight) {
    const paddle = {
      x: canvasWidth / 2 - 60,
      y: canvasHeight - 32,
      width: 140,
      height: 16,
      speed: 8,
      color: '#4cc9f0',
    };

    paddle.update = (input) => {
      if (input.left) {
        paddle.x -= paddle.speed;
      }
      if (input.right) {
        paddle.x += paddle.speed;
      }
      if (paddle.x < 0) paddle.x = 0;
      if (paddle.x > canvasWidth - paddle.width) {
        paddle.x = canvasWidth - paddle.width;
      }
    };

    paddle.reset = () => {
      paddle.x = canvasWidth / 2 - paddle.width / 2;
    };

    paddle.draw = (ctx) => {
      ctx.fillStyle = paddle.color;
      ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    };

    return paddle;
  }

  function createInputState() {
    const input = { left: false, right: false };

    const onKeyDown = (event) => {
      const { code } = event;
      if (code === 'ArrowLeft' || code === 'KeyA') input.left = true;
      if (code === 'ArrowRight' || code === 'KeyD') input.right = true;
      if (code === 'ArrowLeft' || code === 'KeyA' || code === 'ArrowRight' || code === 'KeyD') {
        event.preventDefault();
      }
    };

    const onKeyUp = (event) => {
      const { code } = event;
      if (code === 'ArrowLeft' || code === 'KeyA') input.left = false;
      if (code === 'ArrowRight' || code === 'KeyD') input.right = false;
      if (code === 'ArrowLeft' || code === 'KeyA' || code === 'ArrowRight' || code === 'KeyD') {
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return input;
  }

  window.createPaddle = createPaddle;
  window.createInputState = createInputState;
})();
