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
    lives.textContent = String(gameState.lives);
    level.textContent = String(gameState.level);
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
