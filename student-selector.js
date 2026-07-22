const CLASS_KEY = 'teacherToolsClasses';
let pool = [];
let selectedHistory = [];

function parseNames(text) {
  return [...new Set(text.split(/[\n,]+/).map((name) => name.trim()).filter(Boolean))];
}

function getClasses() {
  try { return JSON.parse(localStorage.getItem(CLASS_KEY) || '{}'); }
  catch { return {}; }
}

function saveClasses(classes) {
  localStorage.setItem(CLASS_KEY, JSON.stringify(classes));
}

function updateClassSelect(preferred = '') {
  const select = document.getElementById('saved-class');
  const classes = getClasses();
  select.innerHTML = '<option value="">Choose a saved class</option>';
  Object.keys(classes).sort().forEach((name) => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });
  if (preferred && classes[preferred]) select.value = preferred;
}

function resetPool() {
  pool = parseNames(document.getElementById('student-list').value);
  selectedHistory = [];
  renderHistory();
  document.getElementById('selector-status').textContent = pool.length ? `${pool.length} students ready.` : 'Add at least one student.';
  document.getElementById('result-kicker').textContent = 'Ready to select';
  document.getElementById('result-name').textContent = pool.length ? 'Press select' : 'Add your class';
}

function renderHistory() {
  const container = document.getElementById('selected-history');
  container.innerHTML = '';
  selectedHistory.slice(-12).forEach((name) => {
    const chip = document.createElement('span');
    chip.className = 'history-chip';
    chip.textContent = name;
    container.appendChild(chip);
  });
}

function randomItems(list, count) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

async function animateSelection(finalNames) {
  const result = document.getElementById('result-name');
  const kicker = document.getElementById('result-kicker');
  const allNames = parseNames(document.getElementById('student-list').value);
  const duration = Number(document.getElementById('animation-speed').value) || 900;
  const interval = 70;
  kicker.textContent = 'Selecting…';

  await new Promise((resolve) => {
    const timer = setInterval(() => {
      result.textContent = allNames[Math.floor(Math.random() * allNames.length)] || '—';
    }, interval);
    setTimeout(() => { clearInterval(timer); resolve(); }, duration);
  });

  result.textContent = finalNames.join(' · ');
  kicker.textContent = finalNames.length === 1 ? 'Selected student' : 'Selected students';
}

document.getElementById('save-class').addEventListener('click', () => {
  const className = document.getElementById('class-name').value.trim();
  const names = parseNames(document.getElementById('student-list').value);
  const status = document.getElementById('selector-status');
  if (!className || !names.length) {
    status.textContent = 'Enter a class name and at least one student.';
    return;
  }
  const classes = getClasses();
  classes[className] = names;
  saveClasses(classes);
  updateClassSelect(className);
  resetPool();
  status.textContent = `${className} saved on this device.`;
});

document.getElementById('saved-class').addEventListener('change', (event) => {
  const name = event.target.value;
  if (!name) return;
  const classes = getClasses();
  document.getElementById('class-name').value = name;
  document.getElementById('student-list').value = (classes[name] || []).join('\n');
  resetPool();
});

document.getElementById('delete-class').addEventListener('click', () => {
  const name = document.getElementById('saved-class').value;
  if (!name) return;
  const classes = getClasses();
  delete classes[name];
  saveClasses(classes);
  updateClassSelect();
  document.getElementById('class-name').value = '';
  document.getElementById('student-list').value = '';
  resetPool();
});

document.getElementById('student-list').addEventListener('input', resetPool);
document.getElementById('reset-pool').addEventListener('click', resetPool);

document.getElementById('select-student').addEventListener('click', async () => {
  const allNames = parseNames(document.getElementById('student-list').value);
  if (!allNames.length) {
    document.getElementById('selector-status').textContent = 'Add at least one student first.';
    return;
  }
  if (!pool.length) pool = [...allNames];
  const requested = Math.max(1, Number(document.getElementById('pick-count').value) || 1);
  const count = Math.min(requested, pool.length);
  const chosen = randomItems(pool, count);
  await animateSelection(chosen);
  selectedHistory.push(...chosen);
  renderHistory();

  if (document.getElementById('remove-selected').checked) {
    const chosenSet = new Set(chosen);
    pool = pool.filter((name) => !chosenSet.has(name));
  }
  document.getElementById('selector-status').textContent = pool.length ? `${pool.length} students remain in the current cycle.` : 'Everyone has had a turn. The pool will reset on the next selection.';
});

document.getElementById('year').textContent = new Date().getFullYear();
updateClassSelect();
resetPool();
