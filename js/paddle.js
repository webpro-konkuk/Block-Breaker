function createPaddle(canvasWidth, canvasHeight) {
  const paddle = {
    x: canvasWidth / 2 - 60,
    y: canvasHeight - 30,
    width: 130,
    height: 14,
    speed: 8,
    color: '#22d3ee',
  };

  paddle.update = (input) => {
    if (input.left) {
      paddle.x -= paddle.speed;
    }
    if (input.right) {
      paddle.x += paddle.speed;
    }

    if (paddle.x < 0) {
      paddle.x = 0;
    }
    if (paddle.x + paddle.width > canvasWidth) {
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
  const input = {
    left: false,
    right: false,
  };

  function keyDown(event) {
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      input.left = true;
      event.preventDefault();
    }
    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      input.right = true;
      event.preventDefault();
    }
  }

  function keyUp(event) {
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      input.left = false;
      event.preventDefault();
    }
    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      input.right = false;
      event.preventDefault();
    }
  }

  window.addEventListener('keydown', keyDown);
  window.addEventListener('keyup', keyUp);
  return input;
}
