const SCREEN_KEY = 'teacherToolsClassroomScreen';
let remaining = 600;
let running = false;
let timerId = null;

function format(seconds) {
  const mins = Math.floor(Math.max(0, seconds) / 60);
  const secs = Math.max(0, seconds) % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
function renderTimer() { document.getElementById('screen-timer').textContent = format(remaining); }
function stopTimer() {
  running = false;
  clearInterval(timerId);
  timerId = null;
  document.getElementById('screen-timer-start').textContent = 'Start';
}
function beep() {
  try {
    const audio = new AudioContext();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.connect(gain); gain.connect(audio.destination);
    oscillator.frequency.value = 720;
    gain.gain.setValueAtTime(.16, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .8);
    oscillator.start(); oscillator.stop(audio.currentTime + .8);
  } catch {}
}

document.getElementById('screen-timer-start').addEventListener('click', () => {
  if (running) { stopTimer(); return; }
  running = true;
  document.getElementById('screen-timer-start').textContent = 'Pause';
  timerId = setInterval(() => {
    remaining -= 1;
    renderTimer();
    if (remaining <= 0) { stopTimer(); beep(); }
  }, 1000);
});
document.getElementById('screen-timer-reset').addEventListener('click', () => { stopTimer(); remaining = 600; renderTimer(); });

document.querySelectorAll('[data-screen-light]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-screen-light]').forEach((item) => item.classList.toggle('active', item === button));
  });
});

document.getElementById('add-schedule-item').addEventListener('click', () => {
  const item = document.createElement('div');
  item.className = 'schedule-item';
  item.contentEditable = 'true';
  item.textContent = 'New schedule item';
  document.getElementById('visual-schedule').appendChild(item);
  item.focus();
});

function saveScreen() {
  const schedule = [...document.querySelectorAll('.schedule-item')].map((item) => item.textContent.trim()).filter(Boolean);
  localStorage.setItem(SCREEN_KEY, JSON.stringify({
    title: document.getElementById('screen-title').textContent.trim(),
    instructions: document.getElementById('lesson-instructions').value,
    schedule
  }));
  const status = document.getElementById('screen-status');
  status.textContent = 'Saved on this device.';
  setTimeout(() => { status.textContent = 'Changes stay on this device.'; }, 1600);
}
function loadScreen() {
  try {
    const data = JSON.parse(localStorage.getItem(SCREEN_KEY) || '{}');
    if (data.title) document.getElementById('screen-title').textContent = data.title;
    if (data.instructions) document.getElementById('lesson-instructions').value = data.instructions;
    if (Array.isArray(data.schedule) && data.schedule.length) {
      const container = document.getElementById('visual-schedule');
      container.innerHTML = '';
      data.schedule.forEach((text) => {
        const item = document.createElement('div');
        item.className = 'schedule-item';
        item.contentEditable = 'true';
        item.textContent = text;
        container.appendChild(item);
      });
    }
  } catch {}
}

document.getElementById('screen-save').addEventListener('click', saveScreen);
document.getElementById('screen-fullscreen').addEventListener('click', async () => {
  try {
    if (!document.fullscreenElement) await document.getElementById('classroom-screen').requestFullscreen();
    else await document.exitFullscreen();
  } catch {}
});

loadScreen();
renderTimer();
