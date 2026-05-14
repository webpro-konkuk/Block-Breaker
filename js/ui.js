(function () {
  function getElement(id) {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Element not found: ${id}`);
    return element;
  }

  function createUI() {
    const status = getElement('status');
    const score = getElement('score');
    const lives = getElement('lives');
    const level = getElement('level');
    const startBtn = getElement('startBtn');
    const pauseBtn = getElement('pauseBtn');
    const restartBtn = getElement('restartBtn');

    const updateHUD = (state) => {
      score.textContent = String(state.score);
      lives.textContent = String(state.lives);
      level.textContent = String(state.level);
    };

    const setStatus = (text) => {
      status.textContent = text;
    };

    const drawCenterText = (ctx, text, color = '#f3f4f9') => {
      ctx.save();
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 28px Trebuchet MS, sans-serif';
      ctx.fillText(text, ctx.canvas.width / 2, ctx.canvas.height / 2);
      ctx.restore();
    };

    return {
      startBtn,
      pauseBtn,
      restartBtn,
      updateHUD,
      setStatus,
      drawCenterText,
    };
  }

  window.createUI = createUI;
})();
