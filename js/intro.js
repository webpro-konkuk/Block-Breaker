document.addEventListener('DOMContentLoaded', () => {
  const introContainer = document.getElementById('introContainer');
  const introImage = document.getElementById('introImage');
  const introText = document.getElementById('introText');

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

  if (!introContainer || !introImage) {
    return;
  }

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
    location.href = 'mainmenu.html';
  }
});