document.addEventListener('DOMContentLoaded', () => {
  const resultScore = document.querySelector('#resultScore');
  const resultLevel = document.querySelector('#resultLevel');
  const resultType = document.querySelector('#resultType');

  const restartBtn = document.querySelector('#restartBtn');
  const mainMenuBtn = document.querySelector('#mainMenuBtn');

  const savedResultType = localStorage.getItem('resultType') || 'fail';
  const score = localStorage.getItem('resultScore') || '0';
  const level = localStorage.getItem('resultLevel') || '1';


  if (savedResultType === 'clear') {
    resultType.innerHTML = 'Clear';
  } else {
    resultType.innerHTML = 'Game Over';
  }

  resultScore.innerHTML = score;
  resultLevel.innerHTML = level;

  restartBtn.addEventListener('click', () => {
    location.href = 'index.html';
  });

  mainMenuBtn.addEventListener('click', () => {
    location.href = 'mainmenu.html';
  });
});