(function () {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const ui = window.createUI();

  const input = window.createInputState();
  const paddle = window.createPaddle(canvas.width, canvas.height);
  const ball = window.createBall(canvas.width, canvas.height);

  const state = {
    phase: 'ready',
    score: 0,
    lives: 3,
    level: 1,
  };

  let bricks = window.createBrickGrid(state.level, canvas.width);

  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0d1224';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    window.drawBricks(ctx, bricks);
    paddle.draw(ctx);
    ball.draw(ctx);

    ui.updateHUD(state);

    if (state.phase === 'ready') {
      ui.drawCenterText(ctx, 'START to begin', '#8de4ff');
    }
    if (state.phase === 'paused') {
      ui.drawCenterText(ctx, 'PAUSED', '#ffdd57');
    }
    if (state.phase === 'gameOver') {
      ui.drawCenterText(ctx, 'GAME OVER', '#ff6b6b');
    }
    if (state.phase === 'clear') {
      ui.drawCenterText(ctx, 'CLEAR!', '#8cff8c');
    }
  };

  const buildStage = () => {
    bricks = window.createBrickGrid(state.level, canvas.width);
    paddle.reset();
    ball.reset(paddle);
  };

  const resetRound = () => {
    paddle.reset();
    ball.reset(paddle);
  };

  const startGame = () => {
    if (state.phase === 'running') return;

    if (state.phase === 'gameOver') {
      state.score = 0;
      state.lives = 3;
      state.level = 1;
      buildStage();
    }

    if (state.phase === 'clear') {
      state.phase = 'running';
      buildStage();
      return;
    }

    state.phase = 'running';
    ui.setStatus('공을 맞춰 점수를 얻으세요');
  };

  const pauseGame = () => {
    if (state.phase !== 'running') return;
    state.phase = 'paused';
    ui.setStatus('일시정지');
  };

  const resumeGame = () => {
    if (state.phase !== 'paused') return;
    state.phase = 'running';
    ui.setStatus('계속 진행');
  };

  const restartGame = () => {
    state.score = 0;
    state.lives = 3;
    state.level = 1;
    state.phase = 'ready';
    buildStage();
    ui.setStatus('재시작 완료, 시작 버튼을 누르세요');
  };

  const nextLevel = () => {
    state.level += 1;
    ball.speed += 0.2;
    ball.vx = (ball.vx < 0 ? -1 : 1) * ball.speed;
    ball.vy = -ball.speed;
    ui.setStatus(`레벨 ${state.level} 준비`);
    buildStage();
  };

  const update = () => {
    if (state.phase !== 'running') return;

    paddle.update(input);
    ball.move();

    if (!window.resolveWallCollision(ball, canvas.width, canvas.height)) {
      state.lives -= 1;
      if (state.lives <= 0) {
        state.phase = 'gameOver';
        ui.setStatus('게임오버 - 재시작을 눌러주세요');
        return;
      }

      state.phase = 'ready';
      ui.setStatus('실패! 시작 버튼으로 계속');
      resetRound();
      return;
    }

    window.resolvePaddleCollision(ball, paddle);

    const hit = window.resolveBrickCollision(ball, bricks);
    if (hit) {
      state.score += hit.points;
      bricks = bricks.filter((brick) => brick.alive);
      if (bricks.length === 0) {
        state.phase = 'clear';
        setTimeout(() => {
          if (state.phase === 'clear') {
            nextLevel();
            state.phase = 'running';
          }
        }, 600);
      }
    }
  };

  const loop = () => {
    update();
    render();
    requestAnimationFrame(loop);
  };

  ui.startBtn.addEventListener('click', startGame);
  ui.pauseBtn.addEventListener('click', () => {
    if (state.phase === 'running') pauseGame();
    else if (state.phase === 'paused') resumeGame();
    else startGame();
  });
  ui.restartBtn.addEventListener('click', restartGame);

  buildStage();
  ui.setStatus('시작 버튼을 눌러 시작');
  state.phase = 'ready';
  loop();
})();
