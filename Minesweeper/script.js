const SIZE = 8;
const MINE_COUNT = 10;
let board = [];          // 2D array of cell objects
let firstClickDone = false;
let gameOver = false;
let revealedCount = 0;
let flagCount = 0;
let timerInterval = null;
let seconds = 0;
const boardEl = document.getElementById('board');
const mineCountEl = document.getElementById('mineCountValue');
const timerEl = document.getElementById('timerValue');
const resetBtn = document.getElementById('resetBtn');
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalTime = document.getElementById('modalTime');
const modalPlayAgain = document.getElementById('modalPlayAgain');
function createEmptyBoard() {
  const b = [];
  for (let r = 0; r < SIZE; r++) {
    const row = [];
    for (let c = 0; c < SIZE; c++) {
      row.push({
        row: r, col: c,
        isMine: false,
        adjacent: 0,
        revealed: false,
        flagged: false,
      });
    }
    b.push(row);
  }
  return b;
}
function placeMines(excludeRow, excludeCol) {
  let placed = 0;
  while (placed < MINE_COUNT) {
    const r = Math.floor(Math.random() * SIZE);
    const c = Math.floor(Math.random() * SIZE);
    const isExcluded = Math.abs(r - excludeRow) <= 1 && Math.abs(c - excludeCol) <= 1;
    if (board[r][c].isMine || isExcluded) continue;
    board[r][c].isMine = true;
    placed++;
  }
  computeAdjacents();
}
function forEachNeighbor(row, col, fn) {
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr, nc = col + dc;
      if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) fn(board[nr][nc]);
    }
  }
}
function computeAdjacents() {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c].isMine) continue;
      let count = 0;
      forEachNeighbor(r, c, (n) => { if (n.isMine) count++; });
      board[r][c].adjacent = count;
    }
  }
}
function renderBoard() {
  boardEl.innerHTML = '';
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const cellEl = document.createElement('div');
      cellEl.className = 'cell';
      cellEl.dataset.row = r;
      cellEl.dataset.col = c;
      cellEl.addEventListener('click', onLeftClick);
      cellEl.addEventListener('contextmenu', onRightClick);
      boardEl.appendChild(cellEl);
    }
  }
}
function getCellEl(row, col) {
  return boardEl.querySelector(`[data-row="${row}"][data-col="${col}"]`);
}
function updateCellDisplay(cell) {
  const el = getCellEl(cell.row, cell.col);
  el.classList.toggle('flagged', cell.flagged && !cell.revealed);
  if (!cell.revealed) {
    el.classList.remove('revealed', 'mine');
    el.textContent = '';
    el.removeAttribute('data-n');
    return;
  }
  el.classList.add('revealed');
  el.classList.remove('flagged');
  if (cell.isMine) {
    el.classList.add('mine');
    el.textContent = '💣';
  } else if (cell.adjacent > 0) {
    el.textContent = cell.adjacent;
    el.dataset.n = cell.adjacent;
  } else {
    el.textContent = '';
  }
}
function onLeftClick(e) {
  if (gameOver) return;
  const row = Number(e.currentTarget.dataset.row);
  const col = Number(e.currentTarget.dataset.col);
  const cell = board[row][col];
  if (cell.flagged || cell.revealed) return;
  if (!firstClickDone) {
    placeMines(row, col);
    firstClickDone = true;
    startTimer();
  }
  if (cell.isMine) {
    revealAllMines(cell);
    endGame(false);
    return;
  }
  floodReveal(row, col);
  checkWin();
}
function onRightClick(e) {
  e.preventDefault();
  if (gameOver) return;
  const row = Number(e.currentTarget.dataset.row);
  const col = Number(e.currentTarget.dataset.col);
  const cell = board[row][col];
  if (cell.revealed) return;
  cell.flagged = !cell.flagged;
  flagCount += cell.flagged ? 1 : -1;
  mineCountEl.textContent = MINE_COUNT - flagCount;
  updateCellDisplay(cell);
}
function floodReveal(startRow, startCol) {
  const queue = [board[startRow][startCol]];
  const seen = new Set([`${startRow},${startCol}`]);
  while (queue.length) {
    const cell = queue.shift();
    if (cell.revealed || cell.flagged) continue;
    cell.revealed = true;
    revealedCount++;
    updateCellDisplay(cell);
    if (cell.adjacent === 0) {
      forEachNeighbor(cell.row, cell.col, (n) => {
        const key = `${n.row},${n.col}`;
        if (!seen.has(key) && !n.revealed) {
          seen.add(key);
          queue.push(n);
        }
      });
    }
  }
}
function revealAllMines(exploded) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const cell = board[r][c];
      if (cell.isMine) {
        cell.revealed = true;
        updateCellDisplay(cell);
        if (cell === exploded) getCellEl(r, c).classList.add('exploded');
      }
    }
  }
}
function checkWin() {
  const totalSafeCells = SIZE * SIZE - MINE_COUNT;
  if (revealedCount === totalSafeCells) {
    endGame(true);
  }
}
function startTimer() {
  seconds = 0;
  timerEl.textContent = '000';
  timerInterval = setInterval(() => {
    seconds++;
    timerEl.textContent = String(Math.min(seconds, 999)).padStart(3, '0');
  }, 1000);
}
function stopTimer() {
  clearInterval(timerInterval);
}
function endGame(won) {
  gameOver = true;
  stopTimer();
  resetBtn.textContent = won ? '😎' : '💀';
  modalTitle.textContent = won ? 'You win!' : 'Boom — game over';
  modalMessage.innerHTML = won
    ? `Cleared the field in <span id="modalTime">${seconds}</span>s.`
    : `You hit a mine at <span id="modalTime">${seconds}</span>s. Try again?`;
  modalOverlay.classList.add('visible');
}
function resetGame() {
  gameOver = false;
  firstClickDone = false;
  revealedCount = 0;
  flagCount = 0;
  stopTimer();
  timerEl.textContent = '000';
  mineCountEl.textContent = MINE_COUNT;
  resetBtn.textContent = '🙂';
  modalOverlay.classList.remove('visible');
  board = createEmptyBoard();
  renderBoard();
}
resetBtn.addEventListener('click', resetGame);
modalPlayAgain.addEventListener('click', resetGame);
resetGame();