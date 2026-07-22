let mode = 'countdown';
let running = false;
let timerId = null;
let remainingSeconds = 300;
let stopwatchSeconds = 0;

const display = document.getElementById('timer-display');
const startButton = document.getElementById('timer-start');
const resetButton = document.getElementById('timer-reset');
const minutesInput = document.getElementById('minutes-input');
const secondsInput = document.getElementById('seconds-input');

function format(seconds) {
  const mins = Math.floor(Math.max(0, seconds) / 60);
  const secs = Math.max(0, seconds) % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
function syncCountdownFromInputs() {
  remainingSeconds = Math.max(0, Number(minutesInput.value || 0) * 60 + Number(secondsInput.value || 0));
  display.textContent = format(remainingSeconds);
}
function stop() {
  running = false;
  clearInterval(timerId);
  timerId = null;
  startButton.textContent = 'Start';
}
function beep() {
  try {
    const audio = new AudioContext();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.connect(gain); gain.connect(audio.destination);
    oscillator.frequency.value = 740;
    gain.gain.setValueAtTime(0.16, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.8);
    oscillator.start(); oscillator.stop(audio.currentTime + 0.8);
  } catch {}
}
function tick() {
  if (mode === 'countdown') {
    remainingSeconds -= 1;
    display.textContent = format(remainingSeconds);
    if (remainingSeconds <= 0) { stop(); beep(); }
  } else if (mode === 'stopwatch') {
    stopwatchSeconds += 1;
    display.textContent = format(stopwatchSeconds);
  }
}

startButton.addEventListener('click', () => {
  if (mode === 'traffic') return;
  if (running) { stop(); startButton.textContent = 'Resume'; return; }
  if (mode === 'countdown' && remainingSeconds <= 0) syncCountdownFromInputs();
  running = true;
  startButton.textContent = 'Pause';
  timerId = setInterval(tick, 1000);
});

resetButton.addEventListener('click', () => {
  stop();
  if (mode === 'countdown') syncCountdownFromInputs();
  if (mode === 'stopwatch') { stopwatchSeconds = 0; display.textContent = '00:00'; }
});

[minutesInput, secondsInput].forEach((input) => input.addEventListener('input', () => { if (!running) syncCountdownFromInputs(); }));

document.querySelectorAll('[data-seconds]').forEach((button) => {
  button.addEventListener('click', () => {
    const seconds = Number(button.dataset.seconds);
    minutesInput.value = Math.floor(seconds / 60);
    secondsInput.value = seconds % 60;
    stop(); syncCountdownFromInputs();
  });
});

document.querySelectorAll('[data-mode]').forEach((button) => {
  button.addEventListener('click', () => {
    stop();
    mode = button.dataset.mode;
    document.querySelectorAll('[data-mode]').forEach((item) => item.classList.toggle('active', item === button));
    document.getElementById('countdown-inputs').classList.toggle('hidden', mode !== 'countdown');
    document.getElementById('quick-times').classList.toggle('hidden', mode !== 'countdown');
    document.getElementById('traffic-controls').classList.toggle('hidden', mode !== 'traffic');
    startButton.classList.toggle('hidden', mode === 'traffic');
    resetButton.classList.toggle('hidden', mode === 'traffic');
    display.classList.toggle('hidden', mode === 'traffic');
    if (mode === 'countdown') syncCountdownFromInputs();
    if (mode === 'stopwatch') { stopwatchSeconds = 0; display.textContent = '00:00'; }
  });
});

document.querySelectorAll('[data-light]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-light]').forEach((item) => item.classList.toggle('active', item === button));
  });
});

document.getElementById('timer-fullscreen').addEventListener('click', async () => {
  try {
    if (!document.fullscreenElement) await document.getElementById('timer-panel').requestFullscreen();
    else await document.exitFullscreen();
  } catch {}
});

document.getElementById('year').textContent = new Date().getFullYear();
syncCountdownFromInputs();
