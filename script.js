let currentPlan = 'FREE';
let aiHintsUsed = 0;
const freeHintLimit = 3;

const board = document.getElementById('board');

const puzzle = [
  [5,3,0,0,7,0,0,0,0],
  [6,0,0,1,9,5,0,0,0],
  [0,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],
  [4,0,0,8,0,3,0,0,1],
  [7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],
  [0,0,0,4,1,9,0,0,5],
  [0,0,0,0,8,0,0,7,9]
];

const solution = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9]
];

let selectedCell = null;
let lives = 3;
let combo = 0;
let seconds = 0;
let gameOver = false;
let gameWon = false;
let notesMode = false;
let moveHistory = [];

/* TIMER */

const timerEl = document.querySelectorAll('.stat-box strong')[0];

setInterval(() => {
  if (gameOver || gameWon) return;

  seconds++;

  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');

  if (timerEl) {
    timerEl.textContent = `${m}:${s}`;
  }
}, 1000);

/* HELPERS */

function getCellValue(cell) {
  if (!cell || cell.querySelector('.notes-grid')) return '';
  return cell.textContent.trim();
}

function saveMove(cell) {
  moveHistory.push({
    cell,
    html: cell.innerHTML,
    className: cell.className,
    lives,
    combo,
    gameOver,
    gameWon
  });
}

function clearTemporaryMarks() {
  document.querySelectorAll('.cell').forEach(cell => {
    cell.classList.remove('error', 'checked-correct');
  });
}

/* BOARD */

function createBoard() {
  if (!board) return;

  board.innerHTML = '';

  puzzle.forEach((row, rowIndex) => {
    row.forEach((number, colIndex) => {
      const cell = document.createElement('div');

      cell.classList.add('cell');
      cell.dataset.row = rowIndex;
      cell.dataset.col = colIndex;

      if (number !== 0) {
        cell.textContent = number;
        cell.classList.add('fixed');
      }

      cell.addEventListener('click', () => {
        selectCell(cell);
      });

      board.appendChild(cell);
    });
  });

  updateLives();
}

createBoard();

/* SELECT CELL */

function selectCell(cell) {
  document.querySelectorAll('.cell').forEach(c => {
    c.classList.remove('selected', 'highlight', 'same-number');
  });

  selectedCell = cell;

  const row = Number(cell.dataset.row);
  const col = Number(cell.dataset.col);
  const val = getCellValue(cell);

  document.querySelectorAll('.cell').forEach(c => {
    const r = Number(c.dataset.row);
    const co = Number(c.dataset.col);

    const sameBox =
      Math.floor(r / 3) === Math.floor(row / 3) &&
      Math.floor(co / 3) === Math.floor(col / 3);

    if (r === row || co === col || sameBox) {
      c.classList.add('highlight');
    }

    if (val && getCellValue(c) === val) {
      c.classList.add('same-number');
    }
  });

  cell.classList.remove('highlight', 'same-number');
  cell.classList.add('selected');
}

/* NUMBER BUTTONS */

document.querySelectorAll('.numbers button').forEach(button => {
  button.addEventListener('click', () => {
    if (
      gameOver ||
      gameWon ||
      !selectedCell ||
      selectedCell.classList.contains('fixed')
    ) {
      return;
    }

    const row = Number(selectedCell.dataset.row);
    const col = Number(selectedCell.dataset.col);
    const value = Number(button.dataset.number);
    const correct = solution[row][col];

    saveMove(selectedCell);
    clearTemporaryMarks();

    if (notesMode) {
      toggleNote(selectedCell, value);
      selectCell(selectedCell);
      return;
    }

    selectedCell.innerHTML = value;
    selectedCell.classList.add('user-input');

    if (value === correct) {
      selectedCell.classList.remove('error');

      combo++;

      showCombo();
      showStatus('correct', 'CORRECT!');

      selectCell(selectedCell);
      checkWin();
    } else {
      combo = 0;
      lives--;

      selectedCell.classList.add('error');

      showStatus('wrong', 'WRONG!');
      updateLives();

      setTimeout(() => {
        selectedCell?.classList.remove('error');
      }, 700);

      if (lives <= 0) {
        gameOver = true;

        setTimeout(() => {
          showStatus('wrong', 'GAME OVER');
        }, 300);
      }
    }
  });
});

/* NOTES */

const notesBtn = document.getElementById('notesBtn');

if (notesBtn) {
  notesBtn.addEventListener('click', () => {
    notesMode = !notesMode;

    notesBtn.classList.toggle('active', notesMode);

    showStatus(
      'correct',
      notesMode ? 'NOTES ON' : 'NOTES OFF'
    );
  });
}

function toggleNote(cell, number) {
  if (cell.classList.contains('fixed')) return;

  let notesGrid = cell.querySelector('.notes-grid');

  if (!notesGrid) {
    cell.innerHTML = '';
    cell.classList.remove('user-input', 'error');

    notesGrid = document.createElement('div');
    notesGrid.classList.add('notes-grid');

    for (let i = 1; i <= 9; i++) {
      const note = document.createElement('span');
      note.dataset.note = i;
      note.textContent = '';
      notesGrid.appendChild(note);
    }

    cell.appendChild(notesGrid);
  }

  const noteCell = notesGrid.querySelector(`[data-note="${number}"]`);

  if (noteCell.textContent) {
    noteCell.textContent = '';
  } else {
    noteCell.textContent = number;
  }
}

/* UNDO */

const undoBtn = document.getElementById('undoBtn');

if (undoBtn) {
  undoBtn.addEventListener('click', () => {
    const lastMove = moveHistory.pop();

    if (!lastMove) {
      showStatus('wrong', 'NO MOVES');
      return;
    }

    lastMove.cell.innerHTML = lastMove.html;
    lastMove.cell.className = lastMove.className;

    lives = lastMove.lives;
    combo = lastMove.combo;
    gameOver = lastMove.gameOver;
    gameWon = lastMove.gameWon;

    updateLives();
    selectCell(lastMove.cell);

    showStatus('correct', 'UNDO');
  });
}

/* CHECK */

const checkBtn = document.getElementById('checkBtn');

if (checkBtn) {
  checkBtn.addEventListener('click', () => {
    let mistakes = 0;
    let filled = 0;

    document.querySelectorAll('.cell').forEach(cell => {
      cell.classList.remove('error', 'checked-correct');

      if (cell.classList.contains('fixed')) return;
      if (cell.querySelector('.notes-grid')) return;

      const value = getCellValue(cell);

      if (!value) return;

      filled++;

      const row = Number(cell.dataset.row);
      const col = Number(cell.dataset.col);

      if (Number(value) === solution[row][col]) {
        cell.classList.add('checked-correct');
      } else {
        cell.classList.add('error');
        mistakes++;
      }
    });

    if (filled === 0) {
      showStatus('wrong', 'NOTHING TO CHECK');
    } else if (mistakes === 0) {
      showStatus('correct', 'LOOKS GOOD');
    } else {
      showStatus('wrong', `${mistakes} MISTAKE`);
    }

    setTimeout(() => {
      document.querySelectorAll('.checked-correct').forEach(cell => {
        cell.classList.remove('checked-correct');
      });
    }, 900);
  });
}

/* AI HINT */

const hintBtn = document.getElementById('hintBtn');

if (hintBtn) {
  hintBtn.addEventListener('click', () => {
    if (gameOver || gameWon) return;
    if (currentPlan === 'FREE' && aiHintsUsed >= freeHintLimit) {
  showStatus('wrong', 'PRO REQUIRED');

  document.querySelector('#premium')?.scrollIntoView({
    behavior: 'smooth'
  });

  return;
}

aiHintsUsed++;


    let targetCell = selectedCell;

    if (
      !targetCell ||
      targetCell.classList.contains('fixed') ||
      getCellValue(targetCell) === String(solution[targetCell.dataset.row][targetCell.dataset.col])
    ) {
      targetCell = findEmptyCell();
    }

    if (!targetCell) {
      showStatus('correct', 'NO HINTS');
      return;
    }

    saveMove(targetCell);
    clearTemporaryMarks();

    const row = Number(targetCell.dataset.row);
    const col = Number(targetCell.dataset.col);
    const correct = solution[row][col];

    targetCell.innerHTML = correct;
    targetCell.classList.remove('error');
    targetCell.classList.add('user-input');

    selectCell(targetCell);
    checkWin();

    showStatus('correct', 'AI HINT');
  });
}

function findEmptyCell() {
  const cells = document.querySelectorAll('.cell');

  for (const cell of cells) {
    if (cell.classList.contains('fixed')) continue;

    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const value = getCellValue(cell);

    if (value !== String(solution[row][col])) {
      return cell;
    }
  }

  return null;
}

/* KEYBOARD */

document.addEventListener('keydown', e => {
  if (
    gameOver ||
    gameWon ||
    !selectedCell ||
    selectedCell.classList.contains('fixed')
  ) {
    return;
  }

  const num = Number(e.key);

  if (num >= 1 && num <= 9) {
    document.querySelector(`.numbers button[data-number="${num}"]`)?.click();
  }

  if (e.key === 'Backspace' || e.key === 'Delete') {
    saveMove(selectedCell);

    selectedCell.innerHTML = '';
    selectedCell.classList.remove('user-input', 'error');

    selectCell(selectedCell);
    showStatus('correct', 'CLEARED');
  }
});

/* WIN */

function checkWin() {
  const cells = document.querySelectorAll('.cell');
  let solved = true;

  cells.forEach(cell => {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);

    if (getCellValue(cell) !== String(solution[row][col])) {
      solved = false;
    }
  });

  if (solved) {
    gameWon = true;

    setTimeout(() => {
      showStatus('correct', 'YOU WIN!');
    }, 200);
  }
}

/* LIVES */

function updateLives() {
  const livesBox = document.querySelectorAll('.stat-box strong')[2];

  if (!livesBox) return;

  livesBox.textContent = lives > 0
    ? '♥ '.repeat(lives).trim()
    : '0';
}

/* COMBO */

function showCombo() {
  if (combo < 2) return;

  const popup = document.getElementById('comboPopup');

  if (!popup) return;

  popup.textContent = `COMBO x${combo}`;
  popup.classList.add('show');

  setTimeout(() => {
    popup.classList.remove('show');
  }, 900);
}

/* STATUS */

function showStatus(type, text) {
  const status = document.getElementById('gameStatus');

  if (!status) return;

  status.textContent = text;
  status.className = `game-status show ${type}`;

  setTimeout(() => {
    status.className = 'game-status';
  }, 1200);
}

/* THEME */

const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');

    themeToggle.textContent = document.body.classList.contains('light-theme')
      ? '☀️'
      : '🌙';
  });
}

/* LOGIN */

const loginBtn = document.querySelector('.login-btn');
const loginModal = document.getElementById('loginModal');

if (loginBtn && loginModal) {
  loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'flex';
  });

  loginModal.addEventListener('click', e => {
    if (e.target === loginModal) {
      loginModal.style.display = 'none';
    }
  });
}

/* AUTH SWITCH */

const switchAuth = document.getElementById('switchAuth');
const authTitle = document.getElementById('authTitle');
const authBtn = document.getElementById('authBtn');

let registerMode = false;

if (switchAuth && authTitle && authBtn) {
  switchAuth.addEventListener('click', () => {
    registerMode = !registerMode;

    if (registerMode) {
      authTitle.textContent = 'Create Account';
      authBtn.textContent = 'REGISTER';
      switchAuth.textContent = 'Login';
    } else {
      authTitle.textContent = 'Welcome Back';
      authBtn.textContent = 'LOGIN';
      switchAuth.textContent = 'Register';
    }
  });
}
/* AUTH SUBMIT */

const authUsername = document.getElementById('authUsername');
const authPassword = document.getElementById('authPassword');

if (authBtn && authUsername && authPassword && loginModal && loginBtn) {
  authBtn.addEventListener('click', () => {
    const username = authUsername.value.trim();
    const password = authPassword.value.trim();

    if (!username || !password) {
      showStatus('wrong', 'FILL ALL FIELDS');
      return;
    }

    loginModal.style.display = 'none';

    loginBtn.textContent = username.toUpperCase();
    loginBtn.disabled = true;

    showStatus(
      'correct',
      registerMode ? 'REGISTERED' : 'LOGGED IN'
    );

    authUsername.value = '';
    authPassword.value = '';
  });
}

/* PAGE BUTTONS */

const playBtn = document.querySelector('.btn-play');
const dailyBtn = document.querySelector('.btn-daily');
const premiumBtn = document.querySelector('.btn-premium');
const coachBtn = document.querySelector('.coach-btn');

playBtn?.addEventListener('click', () => {
  document.querySelector('.game-section')?.scrollIntoView({
    behavior: 'smooth'
  });
});

dailyBtn?.addEventListener('click', () => {
  document.querySelector('.game-section')?.scrollIntoView({
    behavior: 'smooth'
  });

  showStatus('correct', 'DAILY CHALLENGE');
});

premiumBtn?.addEventListener('click', () => {
  document.querySelector('#premium')?.scrollIntoView({
    behavior: 'smooth'
  });
});

coachBtn?.addEventListener('click', () => {
  const chat = document.querySelector('.chat');

  if (!chat) return;

  if (!selectedCell) {
    addCoachMessage('ai', 'Select a cell on the Sudoku board first. Then I can give you a useful hint.');
    document.querySelector('.game-section')?.scrollIntoView({
      behavior: 'smooth'
    });
    return;
  }

  const row = Number(selectedCell.dataset.row);
  const col = Number(selectedCell.dataset.col);

  if (selectedCell.classList.contains('fixed')) {
    addCoachMessage('ai', 'That cell is already fixed. Choose an empty cell and I will help you solve it.');
    return;
  }

  const tip = getCoachTip(row, col);

  addCoachMessage('user', 'Can you help me with this cell?');
  addCoachMessage('ai', tip);

  document.querySelector('#coach')?.scrollIntoView({
    behavior: 'smooth'
  });
});

function addCoachMessage(type, text) {
  const chat = document.querySelector('.chat');

  if (!chat) return;

  const message = document.createElement('div');

  message.className = type === 'user'
    ? 'user-msg'
    : 'ai-msg';

  message.textContent = text;

  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

function getCoachTip(row, col) {
  const correct = solution[row][col];

  const rowNumbers = puzzle[row].filter(num => num !== 0);
  const colNumbers = puzzle.map(r => r[col]).filter(num => num !== 0);

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  const boxNumbers = [];

  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (puzzle[r][c] !== 0) {
        boxNumbers.push(puzzle[r][c]);
      }
    }
  }

  return `Look at row ${row + 1}, column ${col + 1}, and its 3x3 box. The number ${correct} fits here because it does not conflict with the current row, column, or box.`;
}


/* CURSOR */

const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (cursorDot && cursorRing) {
  window.addEventListener('mousemove', e => {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';

    cursorRing.style.left = e.clientX + 'px';
    cursorRing.style.top = e.clientY + 'px';
  });
}

/* REVEAL */

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
});

document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

/* SAKURA */

const sakuraContainer = document.querySelector('.sakura-container');

function createSakura() {
  if (!sakuraContainer) return;

  const petal = document.createElement('div');

  petal.classList.add('sakura');

  petal.style.left = Math.random() * window.innerWidth + 'px';
  petal.style.animationDuration = 8 + Math.random() * 6 + 's';
  petal.style.opacity = 0.4 + Math.random() * 0.6;

  sakuraContainer.appendChild(petal);

  petal.addEventListener('animationend', () => {
    petal.remove();
  });
}

setInterval(createSakura, 350);
/* SUBSCRIPTION */

const proPlanBtn = document.getElementById('proPlanBtn');
const freePlanBtn = document.getElementById('freePlanBtn');

function updatePlanButtons() {
  if (!proPlanBtn || !freePlanBtn) return;

  if (currentPlan === 'PRO') {
    proPlanBtn.textContent = 'CURRENT PLAN';
    freePlanBtn.textContent = 'DOWNGRADE';
  } else {
    proPlanBtn.textContent = 'GET PRO';
    freePlanBtn.textContent = 'CURRENT PLAN';
  }

  const proCard = proPlanBtn.closest('.premium-card');
  const freeCard = freePlanBtn.closest('.premium-card');

  proCard?.classList.toggle('current-plan', currentPlan === 'PRO');
  freeCard?.classList.toggle('current-plan', currentPlan === 'FREE');
}

proPlanBtn?.addEventListener('click', () => {
  currentPlan = 'PRO';
  aiHintsUsed = 0;

  updatePlanButtons();

  showStatus('correct', 'PRO ACTIVE');
});

freePlanBtn?.addEventListener('click', () => {
  currentPlan = 'FREE';
  aiHintsUsed = 0;

  updatePlanButtons();

  showStatus('correct', 'FREE PLAN');
});

updatePlanButtons();
