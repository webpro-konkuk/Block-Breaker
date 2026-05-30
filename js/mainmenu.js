document.addEventListener('DOMContentLoaded', () => {
  const startGameBtn = document.querySelector('#startGameBtn');
  const difficultyBtn = document.querySelector('#difficultyBtn');
  const settingBtn = document.querySelector('#settingBtn');

  const currentLevelText = document.querySelector('#currentLevelText');
  const ballColorBox = document.querySelector('#ballColorBox');
  const paddleColorBox = document.querySelector('#paddleColorBox');

  const savedLevel = localStorage.getItem('selectedLevel') || '1';
  const savedBallColor = localStorage.getItem('ballColor') || '#f59e0b';
  const savedPaddleColor = localStorage.getItem('paddleColor') || '#22d3ee';

  currentLevelText.textContent = `Level ${savedLevel}`;
  ballColorBox.style.backgroundColor = savedBallColor;
  paddleColorBox.style.backgroundColor = savedPaddleColor;

  startGameBtn.addEventListener('click', () => {
    location.href = 'index.html';
  });

  difficultyBtn.addEventListener('click', () => {
    location.href = 'difficulty.html';
  });

  settingBtn.addEventListener('click', () => {
    location.href = 'setting.html';
  });
});