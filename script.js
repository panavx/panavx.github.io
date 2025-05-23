const totalQuestions = 10;
let questionsLog = [];
let currentQuestion = 0;
let correctAnswer = 0;
let startTime = 0;
let questionStartTime = 0;
let totalTime = 0;

const questionText = document.getElementById('questionText');
const answerInput = document.getElementById('answerInput');
const feedback = document.getElementById('feedback');
const submitAnswerBtn = document.getElementById('submitAnswerBtn');
const timerDisplay = document.getElementById('timer');
const gameContainer = document.getElementById('game-container');
const resultContainer = document.getElementById('result-container');
const speedLevelText = document.getElementById('speed-level');
const summary = document.getElementById('summary');
const restartBtn = document.getElementById('restartBtn');

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
  const operations = ['+', '-', '*'];
  const op = operations[Math.floor(Math.random() * operations.length)];
  let num1 = rand(1, 100);
  let num2 = rand(1, 100);

  if (op === '+') correctAnswer = num1 + num2;
  else if (op === '-') correctAnswer = num1 - num2;
  else correctAnswer = num1 * num2;

  questionText.textContent = `${num1} ${op} ${num2} = ?`;
  answerInput.value = "";
  feedback.textContent = "";
  questionStartTime = performance.now();
}

function formatTime(ms) {
  return (ms / 1000).toFixed(3);
}

function evaluateSpeed(avgMs) {
  if (avgMs < 2000) return "🐆 Kamu setara dengan kecepatan cheetah!";
  if (avgMs < 4000) return "🐇 Kamu setara dengan kecepatan kelinci!";
  if (avgMs < 6000) return "🐢 Kamu setara dengan kecepatan kura-kura santai!";
  return "💤 Ayo latihan lagi agar makin cepat!";
}

function submitAnswer() {
  const userAnswer = parseFloat(answerInput.value);
  if (isNaN(userAnswer)) return;

  const now = performance.now();
  const duration = now - questionStartTime;

  questionsLog.push({
    soal: questionText.textContent,
    jawaban: userAnswer,
    benar: userAnswer === correctAnswer,
    waktuMs: duration
  });

  currentQuestion++;
  if (currentQuestion >= totalQuestions) {
    totalTime = now - startTime;
    endGame();
  } else {
    generateQuestion();
  }
}

function endGame() {
  gameContainer.style.display = 'none';
  resultContainer.style.display = 'flex';

  const avgTime = totalTime / totalQuestions;
  speedLevelText.textContent = evaluateSpeed(avgTime);

  let html = `<p>Total waktu: <b>${formatTime(totalTime)} detik</b></p><ol>`;
  questionsLog.forEach((q, i) => {
    const icon = q.benar ? '<span class="correct-icon">✅</span>' : '❌';
    html += `<li><b>${i + 1}. ${q.soal}</b> ${icon}<span>Jawaban: ${q.jawaban}</span><span>Waktu: ${formatTime(q.waktuMs)} detik</span></li>`;
  });
  html += '</ol>';
  summary.innerHTML = html;
}

answerInput.addEventListener('input', () => {
  if (startTime === 0) startTime = performance.now();
});

submitAnswerBtn.addEventListener('click', submitAnswer);

answerInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitAnswer();
});

restartBtn.addEventListener('click', () => window.location.reload());

generateQuestion();

setInterval(() => {
  if (startTime !== 0) {
    const now = performance.now();
    timerDisplay.textContent = `Waktu: ${formatTime(now - startTime)} detik`;
  }
}, 50);
