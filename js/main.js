document.addEventListener('DOMContentLoaded', () => {
  function getSavedLevel() {
    const level = Number.parseInt(localStorage.getItem('selectedLevel') || '1', 10);
    return Number.isNaN(level) ? 1 : level;
  }

  function getSpeedByLevel(level) {
    return 4.5 + (level - 1) * 0.2;
  }

  const gameState = {
    phase: 'ready',
    score: 0,
    lives: 3,
    level: getSavedLevel(),
    animationId: null,
    backgroundImageIndex: -1,
  };

  let canvas;
  let ctx;
  let ui;
  let input;
  let paddle;
  let ball;
  let bricks = [];
  let backgroundImages = [];

  function loadBackgroundImages() {
    backgroundImages = ['./img/sky.jpg', './img/snow.jpg'];
    backgroundImages.forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }

  function applySettings() {
    ball.color = localStorage.getItem('ballColor') || '#f59e0b';
    paddle.color = localStorage.getItem('paddleColor') || '#22d3ee';
    ball.speed = getSpeedByLevel(gameState.level);
  }

  function initObjects() {
    loadBackgroundImages();
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    ui = createUI();
    input = createInputState();
    paddle = createPaddle(canvas.width, canvas.height);
    ball = createBall(canvas.width, canvas.height);
    applySettings();
    bricks = createBrickGrid(gameState.level, canvas.width);
  }

  function buildStage() {
    bricks = createBrickGrid(gameState.level, canvas.width);
    paddle.reset();
    ball.speed = getSpeedByLevel(gameState.level);
    ball.reset(paddle);
  }

  function pickNextBackgroundImage() {
    const count = backgroundImages.length;
    if (count === 0) {
      return;
    }

    gameState.backgroundImageIndex = (gameState.backgroundImageIndex + 1) % count;
    const imagePath = backgroundImages[gameState.backgroundImageIndex];
    document.body.style.setProperty('--game-background-image', `url("${imagePath}")`);
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

  function finishGame(resultType) {
    localStorage.setItem('resultScore', String(gameState.score));
    localStorage.setItem('resultLevel', String(gameState.level));
    localStorage.setItem('resultType', resultType);
    location.href = 'result.html';
  }

  function damageBrickByEffect(brick, amount) {
    if (!brick.alive || typeof brick.hp !== 'number') {
      return 0;
    }

    brick.hp -= amount;
    if (brick.hp <= 0) {
      brick.alive = false;
      return brick.point;
    }
    return 0;
  }

  function damageRow(row, amount) {
    let score = 0;
    for (let i = 0; i < bricks.length; i += 1) {
      const brick = bricks[i];
      if (brick.alive && brick.row === row) {
        score += damageBrickByEffect(brick, amount);
      }
    }
    return score;
  }

  function dropBricks() {
    for (let i = 0; i < bricks.length; i += 1) {
      const brick = bricks[i];
      if (brick.alive) {
        brick.row += 1;
        brick.y += brick.height + 8;
      }
    }
  }

  function respawnBrickRandom(brick) {
    const aliveBricks = bricks.filter((item) => item.alive && item !== brick);
    const baseBrick = aliveBricks[Math.floor(Math.random() * aliveBricks.length)] || brick;
    const offsetX = Math.floor(Math.random() * 5) - 2;
    const offsetY = Math.floor(Math.random() * 3) - 1;

    brick.x = Math.max(24, Math.min(canvas.width - brick.width - 24, baseBrick.x + offsetX * 24));
    brick.y = Math.max(54, baseBrick.y + offsetY * 28);
    brick.hp = brick.maxHp;
    brick.alive = true;
  }

  function clearTagBricks(currentBricks, targetTag) {
    let gainedScore = 0;
    const nextBricks = currentBricks.map((brick) => {
      if (!targetTag || !brick.alive || brick.tag !== targetTag) {
        return brick;
      }

      gainedScore += brick.point || 0;
      return { ...brick, hp: 0, alive: false };
    });

    return { nextBricks, gainedScore };
  }

  function applyBrickEffect(result) {
    if (!result.effect) {
      return;
    }

    if (result.effect.kind === 'rowDamage') {
      gameState.score += damageRow(result.hitBrick.row, result.effect.amount || 1);
    }
    if (result.effect.kind === 'dropRow') {
      dropBricks();
    }
    if (result.effect.kind === 'ballGrow') {
      ball.grow?.(result.effect.amount ?? 2);
    }
    if (result.effect.kind === 'backgroundImage') {
      pickNextBackgroundImage();
    }
    if (result.effect.kind === 'respawnRandom') {
      respawnBrickRandom(result.hitBrick);
    }
    if (result.effect.kind === 'clearTag') {
      const { nextBricks, gainedScore } = clearTagBricks(bricks, result.effect.targetTag);
      bricks = nextBricks;
      gameState.score += gainedScore;
    }
  }

  function clearDeadBricksAndCheckLevel() {
    bricks = bricks.filter((brick) => brick.alive);
    if (bricks.length !== 0) {
      return;
    }

    gameState.phase = 'clear';
    if (gameState.level >= 3) {
      finishGame('clear');
      return;
    }

    ui.setStatus(`레벨 ${gameState.level + 1} 준비`);
    setTimeout(nextLevel, 600);
  }

  function checkCollision() {
    if (!resolveWallCollision(ball, canvas.width, canvas.height)) {
      gameState.lives -= 1;
      if (gameState.lives <= 0) {
        gameState.phase = 'gameOver';
        finishGame('fail');
        return;
      }

      gameState.phase = 'ready';
      ball.reset(paddle);
      ui.setStatus('목숨 1개 감소. START로 계속');
      return;
    }

    resolvePaddleCollision(ball, paddle);
    const gained = resolveBrickCollision(ball, bricks);
    if (typeof gained === 'number') {
      if (gained > 0) {
        gameState.score += gained;
        clearDeadBricksAndCheckLevel();
      }
      return;
    }

    if (!gained || typeof gained !== 'object') {
      return;
    }

    gameState.score += gained.score || 0;
    applyBrickEffect(gained);
    clearDeadBricksAndCheckLevel();
  }

  function nextLevel() {
    if (gameState.phase !== 'clear') return;
    gameState.level += 1;
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

  function resetGame() {
    gameState.score = 0;
    gameState.lives = 3;
    gameState.level = getSavedLevel();
    applySettings();
    buildStage();
  }

  function startGame() {
    if (gameState.phase === 'running') return;
    if (gameState.phase === 'gameOver') {
      resetGame();
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
    resetGame();
    gameState.phase = 'ready';
    ui.setStatus('재시작 완료, START로 시작');
  }

  function setupEvents() {
    ui.startBtn.addEventListener('click', startGame);
    ui.pauseBtn.addEventListener('click', pauseGame);
    ui.restartBtn.addEventListener('click', restartGame);

    const mainMenu = document.querySelector('#mainMenuBtn');
    mainMenu.addEventListener('click', () => {
      location.href = 'mainmenu.html';
    });
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
