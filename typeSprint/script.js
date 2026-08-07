const TEST_DURATION = 60; // seconds
const TEXT_BANK = [
  "The quick brown fox jumps over the lazy dog while the sun sets slowly behind the distant mountains.",
  "Practice makes perfect, but only if you practice with focus, patience, and a willingness to learn from mistakes.",
  "Technology continues to reshape how people communicate, work, and solve problems across the entire world.",
  "A good programmer writes code that not only works correctly but is also easy for others to read and maintain.",
  "The library was quiet except for the soft rustle of pages and the occasional creak of an old wooden chair.",
  "Success is rarely a straight line; it usually comes after many small failures that teach valuable lessons.",
  "Coffee brewed early in the morning has a way of making even the busiest day feel a little more manageable.",
  "Every keystroke you make brings you one step closer to typing faster and more accurately than before.",
];
let targetText = '';
let charSpans = [];
let currentIndex = 0;
let mistakes = 0;
let timeRemaining = TEST_DURATION;
let timerInterval = null;
let testStarted = false;
let testFinished = false;
let totalTypedChars = 0;
let correctTypedChars = 0;
const textDisplay = document.getElementById('textDisplay');
const typingInput = document.getElementById('typingInput');
const timeLeftEl = document.getElementById('timeLeft');
const wpmValueEl = document.getElementById('wpmValue');
const accuracyValueEl = document.getElementById('accuracyValue');
const mistakeValueEl = document.getElementById('mistakeValue');
const bestWpmEl = document.getElementById('bestWpm');
const restartBtn = document.getElementById('restartBtn');
const modalOverlay = document.getElementById('modalOverlay');
const finalWpmEl = document.getElementById('finalWpm');
const finalAccuracyEl = document.getElementById('finalAccuracy');
const finalMistakesEl = document.getElementById('finalMistakes');
const modalNote = document.getElementById('modalNote');
const modalRestartBtn = document.getElementById('modalRestartBtn');
function getBestWpm() {
  return Number(sessionStorage.getItem('typemaster_best_wpm') || 0);
}
function setBestWpm(wpm) {
  sessionStorage.setItem('typemaster_best_wpm', String(wpm));
  bestWpmEl.textContent = wpm;
}
function pickText() {
  const idx = Math.floor(Math.random() * TEXT_BANK.length);
  return TEXT_BANK[idx];
}
function renderText() {
  textDisplay.innerHTML = '';
  charSpans = [];
  targetText.split('').forEach((ch) => {
    const span = document.createElement('span');
    span.textContent = ch;
    textDisplay.appendChild(span);
    charSpans.push(span);
  });
  if (charSpans.length) charSpans[0].classList.add('current');
}
function updateLiveStats() {
  const elapsedMinutes = (TEST_DURATION - timeRemaining) / 60 || (1 / 60);
  const wpm = Math.round((correctTypedChars / 5) / elapsedMinutes);
  wpmValueEl.textContent = testStarted ? Math.max(wpm, 0) : 0;
  const accuracy = totalTypedChars === 0
    ? 100
    : Math.round((correctTypedChars / totalTypedChars) * 100);
  accuracyValueEl.textContent = `${accuracy}%`;
  mistakeValueEl.textContent = mistakes;
}
function handleInput() {
  if (testFinished) return;
  if (!testStarted) startTest();
  const typed = typingInput.value;
  charSpans.forEach((span) => span.className = '');
  correctTypedChars = 0;
  totalTypedChars = typed.length;
  for (let i = 0; i < typed.length; i++) {
    if (i >= charSpans.length) break; // typed past the end of the passage
    const expected = targetText[i];
    const actual = typed[i];
    if (actual === expected) {
      charSpans[i].classList.add('correct');
      correctTypedChars++;
    } else {
      charSpans[i].classList.add('incorrect');
    }
  }
  if (typed.length > currentIndex) {
    const lastIdx = typed.length - 1;
    if (lastIdx < targetText.length && typed[lastIdx] !== targetText[lastIdx]) {
      mistakes++;
    }
  }
  currentIndex = typed.length;
  if (currentIndex < charSpans.length) {
    charSpans[currentIndex].classList.add('current');
  }
  updateLiveStats();
  if (typed.length >= targetText.length) {
    endTest();
  }
}
function startTest() {
  testStarted = true;
  timerInterval = setInterval(() => {
    timeRemaining--;
    timeLeftEl.textContent = timeRemaining;
    updateLiveStats();
    if (timeRemaining <= 0) endTest();
  }, 1000);
}
function endTest() {
  if (testFinished) return;
  testFinished = true;
  clearInterval(timerInterval);
  typingInput.disabled = true;
  const elapsedSeconds = TEST_DURATION - timeRemaining;
  const elapsedMinutes = Math.max(elapsedSeconds, 1) / 60;
  const finalWpm = Math.round((correctTypedChars / 5) / elapsedMinutes);
  const finalAccuracy = totalTypedChars === 0
    ? 100
    : Math.round((correctTypedChars / totalTypedChars) * 100);
  finalWpmEl.textContent = finalWpm;
  finalAccuracyEl.textContent = `${finalAccuracy}%`;
  finalMistakesEl.textContent = mistakes;
  const best = getBestWpm();
  if (finalWpm > best) {
    setBestWpm(finalWpm);
    modalNote.textContent = 'New personal best! 🎉';
  } else {
    modalNote.textContent = `Personal best is still ${best} WPM.`;
  }
  modalOverlay.classList.add('visible');
}
function resetTest() {
  clearInterval(timerInterval);
  testStarted = false;
  testFinished = false;
  timeRemaining = TEST_DURATION;
  mistakes = 0;
  currentIndex = 0;
  totalTypedChars = 0;
  correctTypedChars = 0;
  targetText = pickText();
  renderText();
  typingInput.value = '';
  typingInput.disabled = false;
  typingInput.focus();
  timeLeftEl.textContent = timeRemaining;
  wpmValueEl.textContent = 0;
  accuracyValueEl.textContent = '100%';
  mistakeValueEl.textContent = 0;
  modalOverlay.classList.remove('visible');
}
typingInput.addEventListener('input', handleInput);
restartBtn.addEventListener('click', resetTest);
modalRestartBtn.addEventListener('click', resetTest);
typingInput.addEventListener('paste', (e) => e.preventDefault());
bestWpmEl.textContent = getBestWpm();
resetTest();