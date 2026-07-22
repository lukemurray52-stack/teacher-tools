const CLASS_KEY = 'teacherToolsClasses';

function getClasses() {
  try { return JSON.parse(localStorage.getItem(CLASS_KEY) || '{}'); }
  catch { return {}; }
}
function parseNames(text) { return [...new Set(text.split(/[\n,]+/).map((x) => x.trim()).filter(Boolean))]; }
function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function populateClasses() {
  const select = document.getElementById('group-class');
  const classes = getClasses();
  Object.keys(classes).sort().forEach((name) => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });
}
function buildGroups(names, mode, value) {
  const mixed = shuffle(names);
  let groupCount;
  if (mode === 'size') groupCount = Math.ceil(mixed.length / value);
  else groupCount = Math.min(value, mixed.length);
  groupCount = Math.max(1, groupCount);
  const groups = Array.from({ length: groupCount }, () => []);
  mixed.forEach((name, index) => groups[index % groupCount].push(name));
  return groups;
}
function renderGroups() {
  const names = parseNames(document.getElementById('group-student-list').value);
  const status = document.getElementById('group-status');
  if (names.length < 2) {
    status.textContent = 'Add at least two students.';
    return;
  }
  const mode = document.getElementById('group-mode').value;
  const number = Math.max(2, Number(document.getElementById('group-number').value) || 2);
  const groups = buildGroups(names, mode, number);
  const container = document.getElementById('group-cards');
  container.innerHTML = '';
  groups.forEach((group, index) => {
    const card = document.createElement('article');
    card.className = 'group-card';
    const title = document.createElement('h3');
    title.textContent = `Group ${index + 1}`;
    const list = document.createElement('ul');
    group.forEach((name) => {
      const item = document.createElement('li');
      item.textContent = name;
      list.appendChild(item);
    });
    card.append(title, list);
    container.appendChild(card);
  });
  status.textContent = `${names.length} students placed into ${groups.length} groups.`;
}

document.getElementById('group-class').addEventListener('change', (event) => {
  const names = getClasses()[event.target.value] || [];
  document.getElementById('group-student-list').value = names.join('\n');
});
document.getElementById('make-groups').addEventListener('click', renderGroups);
document.getElementById('shuffle-groups').addEventListener('click', renderGroups);
document.getElementById('year').textContent = new Date().getFullYear();
populateClasses();
