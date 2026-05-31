document.addEventListener('DOMContentLoaded', () => {
  const resultScore = document.querySelector('#resultScore');
  const resultLevel = document.querySelector('#resultLevel');
  const resultType = document.querySelector('#resultType');

  const restartBtn = document.querySelector('#restartBtn');
  const mainMenuBtn = document.querySelector('#mainMenuBtn');

  const savedResultType = localStorage.getItem('resultType') || 'fail';
  const score = Number.parseInt(localStorage.getItem('resultScore') || '0', 10);
  const level = Number.parseInt(localStorage.getItem('resultLevel') || '1', 10);

  //leaderBoard
  const leaderBoardMessage = document.querySelector('#leaderBoardMessage');
  const leaderBoardList = document.querySelector('#leaderBoardList');

  if (savedResultType === 'clear') {
    resultType.innerHTML = 'Clear';
  } else {
    resultType.innerHTML = 'Game Over';
  }

  resultScore.innerHTML = String(score);
  resultLevel.innerHTML = String(level);

  restartBtn.addEventListener('click', () => {
    location.href = 'index.html';
  });

  mainMenuBtn.addEventListener('click', () => {
    location.href = 'mainmenu.html';
  });

  //leaderBoard funciton

  function getLeaderBoard() {
    const savedLeaderBoard = localStorage.getItem('leaderBoard');

    if (!savedLeaderBoard) {
      return [];
    }

    return JSON.parse(savedLeaderBoard);
  }

  function saveLeaderBoard(leaderBoard) {
    localStorage.setItem('leaderBoard', JSON.stringify(leaderBoard));
  }

  function canEnterLeaderBoard(score, leaderBoard) {
    if (leaderBoard.length < 15) {
      return true;
    }

    return score > leaderBoard[14].score;
  }

  function isDuplicateRecord(newRecord, leaderBoard) {
    return leaderBoard.some((record) => (
      record.name === newRecord.name &&
      record.score === newRecord.score &&
      record.level === newRecord.level &&
      record.resultType === newRecord.resultType
    ));
  }

  function renderLeaderBoard(leaderBoard) {
    leaderBoardList.innerHTML = '';

    leaderBoard.forEach((record) => {
      const item = document.createElement('li');
      item.textContent = `${record.name} - ${record.score}점`;
      leaderBoardList.appendChild(item);
    });
  }

  //leader Board logic
  let leaderBoard = getLeaderBoard();

  leaderBoard.sort((a, b) => b.score - a.score);

  if (canEnterLeaderBoard(score, leaderBoard)) {
    leaderBoardMessage.textContent = '리더보드 상위 15인 안에 드셨어요!';

    const playerName = prompt('개인 기록 상위 15위 안에 들었습니다! 이름을 입력하세요.')?.trim();

    if (playerName) {
      const newRecord = {
        name: playerName,
        score,
        level,
        resultType: savedResultType,
      };

      if (!isDuplicateRecord(newRecord, leaderBoard)) {
        leaderBoard.push(newRecord);
        leaderBoard.sort((a, b) => b.score - a.score);
        leaderBoard = leaderBoard.slice(0, 15);

        saveLeaderBoard(leaderBoard);
      }
    }
  } else {
    leaderBoardMessage.textContent = '아쉽게도 개인 리더보드 상위 15위 안에 들지 못했습니다.';
  }

  renderLeaderBoard(leaderBoard);
});
