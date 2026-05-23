document.addEventListener('DOMContentLoaded', () => {
  const gameState = {
    phase: 'ready',
    score: 0,
    lives: 3,
    level: 1,
    animationId: null,
  };

  let canvas;
  let ctx;
  let ui;
  let input;
  let paddle;
  let ball;
  let bricks = [];

  function initObjects() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    ui = createUI();
    input = createInputState();
    paddle = createPaddle(canvas.width, canvas.height);
    ball = createBall(canvas.width, canvas.height);
    bricks = createBrickGrid(gameState.level, canvas.width);
  }

  function buildStage() {
    bricks = createBrickGrid(gameState.level, canvas.width);
    paddle.reset();
    ball.reset(paddle);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawBricks(ctx, bricks);
    paddle.draw(ctx);
    ball.draw(ctx);

    ui.updateHUD(gameState);

    if (gameState.phase === 'ready') {
      ui.drawMessage(ctx, 'START 버튼을 눌러 시작', '#8be9fd');
    }
    if (gameState.phase === 'paused') {
      ui.drawMessage(ctx, '일시정지', '#facc15');
    }
    if (gameState.phase === 'gameOver') {
      ui.drawMessage(ctx, 'GAME OVER', '#ef4444');
    }
    if (gameState.phase === 'clear') {
      ui.drawMessage(ctx, 'CLEAR', '#4ade80');
    }
  }

  function checkCollision() {
    if (!resolveWallCollision(ball, canvas.width, canvas.height)) {
      gameState.lives -= 1;
      if (gameState.lives <= 0) {
        gameState.phase = 'gameOver';
        ui.setStatus('게임 오버 - 재시작 버튼을 눌러주세요');
        return;
      }

      gameState.phase = 'ready';
      ball.reset(paddle);
      ui.setStatus('목숨 1개 감소. START로 계속');
      return;
    }

    resolvePaddleCollision(ball, paddle);

    const gained = resolveBrickCollision(ball, bricks);
    if (gained > 0) {
      gameState.score += gained;
      bricks = bricks.filter((b) => b.alive);
      if (bricks.length === 0) {
        gameState.phase = 'clear';
        ui.setStatus(`레벨 ${gameState.level + 1} 준비`);
        setTimeout(nextLevel, 600);
      }
    }
  }

  function nextLevel() {
    if (gameState.phase !== 'clear') return;
    gameState.level += 1;
    ball.speed += 0.2;
    ball.vx = (ball.vx > 0 ? 1 : -1) * ball.speed;
    ball.vy = -ball.speed;
    buildStage();
    gameState.phase = 'running';
    ui.setStatus('게임 진행 중');
  }

  function update() {
    if (gameState.phase !== 'running') {
      return;
    }

    paddle.update(input);
    ball.move();
    checkCollision();
  }

  function loop() {
    update();
    draw();
    gameState.animationId = requestAnimationFrame(loop);
  }

  function startGame() {
    if (gameState.phase === 'running') return;

    if (gameState.phase === 'gameOver') {
      gameState.score = 0;
      gameState.lives = 3;
      gameState.level = 1;
      ball.speed = 4.5;
      buildStage();
    }

    gameState.phase = 'running';
    ui.setStatus('게임 진행 중');
  }

  function pauseGame() {
    if (gameState.phase !== 'running') {
      if (gameState.phase === 'paused') {
        gameState.phase = 'running';
        ui.setStatus('게임 진행 중');
      }
      return;
    }

    gameState.phase = 'paused';
    ui.setStatus('일시정지. 다시 누르면 재개');
  }

  function restartGame() {
    gameState.score = 0;
    gameState.lives = 3;
    gameState.level = 1;
    ball.speed = 4.5;
    buildStage();
    gameState.phase = 'ready';
    ui.setStatus('재시작 완료, START로 시작');
  }

  function setupEvents() {
    ui.startBtn.addEventListener('click', startGame);
    ui.pauseBtn.addEventListener('click', pauseGame);
    ui.restartBtn.addEventListener('click', restartGame);
  }

  function init() {
    initObjects();
    setupEvents();
    buildStage();
    ui.setStatus('준비: 시작 버튼을 눌러 주세요');
    gameState.phase = 'ready';
    loop();
  }

  init();
});
