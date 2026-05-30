document.addEventListener('DOMContentLoaded', () => {
  const ballColorInput = document.querySelector('#ballColorInput');
  const paddleColorInput = document.querySelector('#paddleColorInput');
  const bgmSelect = document.querySelector('#bgmSelect');
  const bgmVolume = document.querySelector('#bgmVolume');

  const saveSettingBtn = document.querySelector('#saveSettingBtn');
  const backMenuBtn = document.querySelector('#backMenuBtn');
  const bgmTypes = ['bgm1', 'bgm2'];

  const savedBallColor = localStorage.getItem('ballColor') || '#f59e0b';
  const savedPaddleColor = localStorage.getItem('paddleColor') || '#22d3ee';
  const savedBgmType = localStorage.getItem('bgmType') || 'bgm1';
  const savedBgmVolume = localStorage.getItem('bgmVolume') || 50;

  ballColorInput.value = savedBallColor;
  paddleColorInput.value = savedPaddleColor;
  bgmSelect.value = bgmTypes.includes(savedBgmType) ? savedBgmType : 'bgm1';
  bgmVolume.value = savedBgmVolume;

  saveSettingBtn.addEventListener('click', () => {
    localStorage.setItem('ballColor', ballColorInput.value);
    localStorage.setItem('paddleColor', paddleColorInput.value);
    localStorage.setItem('bgmType', bgmSelect.value);
    localStorage.setItem('bgmVolume', bgmVolume.value);

    alert('설정이 저장되었습니다.');
  });

  backMenuBtn.addEventListener('click', () => {
    location.href = 'mainmenu.html';
  });
});
