document.addEventListener('DOMContentLoaded', () => {
  const level1 = document.querySelector('#level1');
  const level2 = document.querySelector('#level2');
  const level3 = document.querySelector('#level3');
  const backMenuBtn = document.querySelector('#backMenuBtn');

  level1.addEventListener('click', () => {
    localStorage.setItem('selectedLevel', '1');
    alert('Level 1로 설정되었습니다.');
  });

  level2.addEventListener('click', () => {
    localStorage.setItem('selectedLevel', '2');
    alert('Level 2로 설정되었습니다.');
  });

  level3.addEventListener('click', () => {
    localStorage.setItem('selectedLevel', '3');
    alert('Level 3로 설정되었습니다.');
  });

  backMenuBtn.addEventListener('click', () => {
    location.href = 'mainmenu.html';
  });
});