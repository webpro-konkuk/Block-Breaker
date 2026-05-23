document.addEventListener('DOMContentLoaded', () => {
  const gameState = {
    phase: 'ready',
    score: 0,
    lives: 3,
    level: 1,
    animationId: null,
    backgroundImageIndex: 0,
    backgroundImage: null,
  };

  let canvas;
  let ctx;
  let ui;
  let input;
  let paddle;
  let ball;
  let bricks = [];
  let backgroundImages = [];
  let backgroundImageCache = [];

  function initObjects() {
    

    backgroundImages = [
      './img/sky.jpg',
      './img/snow.jpg',
    ];

    // 이미지들 -> Image 객체 배열로 변경 
    backgroundImageCache = backgroundImages.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    gameState.backgroundImage = backgroundImageCache[0] || null;


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

  function pickNextBackgroundImage() {
    const count = backgroundImageCache.length;
    if (count === 0) {
      gameState.backgroundImage = null;
      return;
    }

    gameState.backgroundImageIndex = (gameState.backgroundImageIndex + 1) % count;
    gameState.backgroundImage = backgroundImageCache[gameState.backgroundImageIndex] || null;
  }

  function drawBackground() {
    const bg = gameState.backgroundImage;

    if(bg && bg.complete && bg.naturalWidth > 0) {
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
      return;
    }

    // 실패하면 그냥 색 채우기
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function draw() {
    
    drawBackground();

    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = '#0b1220';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

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
      if (!brick.alive || brick.row !== row) {
        continue;
      }

      score += damageBrickByEffect(brick, amount);
    }

    return score;
  }

  function dropBricks() {
    for (let i = 0; i < bricks.length; i += 1) {
      const brick = bricks[i];
      if (!brick.alive) {
        continue;
      }

      brick.row += 1;
      brick.y += brick.height + 8;
    }
  }

  function clearDeadBricksAndCheckLevel() {
    bricks = bricks.filter((b) => b.alive);
    if (bricks.length === 0) {
      gameState.phase = 'clear';
      ui.setStatus(`레벨 ${gameState.level + 1} 준비`);
      setTimeout(nextLevel, 600);
    }
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

    if (result.effect.kind === 'clearTag') {
      const { nextBricks, gainedScore } = clearTagBricks(bricks, result.effect.targetTag);
      bricks = nextBricks;
      gameState.score += gainedScore;
    }
  }

  function clearTagBricks(currentBricks, targetTag) {
    let gainedScore = 0;
    if (!targetTag) {
      return {
        nextBricks: currentBricks,
        gainedScore,
      };
    }

    const nextBricks = currentBricks.map((brick) => {
      if (!brick.alive) {
        return brick;
      }

      if (brick.tag !== targetTag) {
        return brick;
      }

      // 기존 brick에 hp, alive만 수정해서 반환
      gainedScore += brick.point || 0;
      return {
        ...brick,
        hp: 0,
        alive: false,
      };
    });

    return {
      nextBricks,
      gainedScore,
    };
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
