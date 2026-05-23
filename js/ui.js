function getNode(id) {
  const node = document.getElementById(id);
  if (!node) {
    throw new Error(`요소를 찾지 못했습니다: ${id}`);
  }
  return node;
}

function createUI() {
  const status = getNode('status');
  const score = getNode('score');
  const lives = getNode('lives');
  const level = getNode('level');
  const startBtn = getNode('startBtn');
  const pauseBtn = getNode('pauseBtn');
  const restartBtn = getNode('restartBtn');

  function updateHUD(gameState) {
  score.textContent = String(gameState.score);
  level.textContent = String(gameState.level);
  
  const heartCount = Math.max(0, gameState.lives);
  lives.textContent = '❤️'.repeat(heartCount);
}

  function setStatus(text) {
    status.textContent = text;
  }

  function drawMessage(ctx, message, color) {
    ctx.fillStyle = color || '#ffffff';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(message, ctx.canvas.width / 2, ctx.canvas.height / 2);
  }

  return {
    startBtn,
    pauseBtn,
    restartBtn,
    updateHUD,
    setStatus,
    drawMessage,
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const introContainer = document.getElementById('introContainer');
  const introImage = document.getElementById('introImage');
  // html에 id를 추가했으니 이제 정상적으로 요소를 잡을 수 있습니다.
  const mainGameContainer = document.getElementById('mainGameContainer'); 

  let currentIntroIndex = 1;
  const maxIntroIndex = 14;

  const introScripts = [
    "", 
    "내 이름은 컴붕이.",
    "22학번 컴퓨터공학부 학생이다", 
    "군대를 갖다오고나니 어느새 2026년이 되어버렸고", 
    "신입생이었던 나는", 
    "어느새 화석이 되어버렸다",
    "2학년 수업인 웹프로그래밍을 이제서야 듣다니...",
    "JS를 공부하느라 HTML이 가물가물한 요즘이다",
    "그렇게 누워서 핸드폰을 하던 중",
    `"엥? 이게 뭐야"`,
    `"내 핸드폰에 이런 게임이 있었나?"`,
    `"딱봐도 너무 수상한데.."`,
    `"HTML 벽돌 깨기라고..?"`,
    `"......"`,
    `"속는셈치고 한번 해볼까?"`
  ];

  if (introText) {
    introText.textContent = introScripts[1];
  }

  for (let i = 1; i <= maxIntroIndex; i++) {
    const img = new Image();
    img.src = `intro${i}.png`;
  }

  introContainer.addEventListener('click', () => {
    if (currentIntroIndex < maxIntroIndex) {
      currentIntroIndex += 1;
      introImage.src = `intro${currentIntroIndex}.png`; 
      if (introText) {
        introText.textContent = introScripts[currentIntroIndex];
      }
    } else {
      endIntro();
    }
  });

  function endIntro() {
    introContainer.style.display = 'none'; 
    if (mainGameContainer) {
      mainGameContainer.style.display = 'block';
    }
    document.body.classList.add('game-bg-active');
  }
});