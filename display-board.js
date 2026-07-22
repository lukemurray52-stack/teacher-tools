const WORDS = [
  { word: 'Adapt', type: 'verb', definition: 'To change in order to suit new conditions.', example: 'Animals adapt to survive in their environments.' },
  { word: 'Curious', type: 'adjective', definition: 'Eager to know or learn something.', example: 'The curious student asked thoughtful questions.' },
  { word: 'Diligent', type: 'adjective', definition: 'Showing careful and steady effort.', example: 'Mia was diligent when checking her research notes.' },
  { word: 'Vivid', type: 'adjective', definition: 'Producing strong, clear pictures in the mind.', example: 'The author used vivid details to describe the storm.' },
  { word: 'Investigate', type: 'verb', definition: 'To examine something carefully to discover facts.', example: 'The class will investigate how shadows change.' },
  { word: 'Resilient', type: 'adjective', definition: 'Able to recover and keep going after difficulty.', example: 'The resilient team tried a new strategy after losing.' },
  { word: 'Contribute', type: 'verb', definition: 'To give or add something to help a shared task.', example: 'Every student contributed an idea to the project.' },
  { word: 'Remarkable', type: 'adjective', definition: 'Unusual or special enough to be noticed.', example: 'The tiny bird completed a remarkable migration.' },
  { word: 'Observe', type: 'verb', definition: 'To watch carefully and notice details.', example: 'We observed the caterpillar through a magnifying glass.' },
  { word: 'Ingenious', type: 'adjective', definition: 'Clever, original and skilfully designed.', example: 'The group built an ingenious bridge from paper.' },
  { word: 'Collaborate', type: 'verb', definition: 'To work with others towards a shared goal.', example: 'The students collaborated on the class mural.' },
  { word: 'Precise', type: 'adjective', definition: 'Exact, accurate and carefully stated.', example: 'Use precise measurements when cutting the card.' },
  { word: 'Transform', type: 'verb', definition: 'To change something greatly in form or appearance.', example: 'A caterpillar transforms into a butterfly.' },
  { word: 'Resourceful', type: 'adjective', definition: 'Good at finding clever ways to solve problems.', example: 'The resourceful campers repaired the tent with string.' },
  { word: 'Perspective', type: 'noun', definition: 'A particular way of viewing or understanding something.', example: "The story is told from the dog's perspective." },
  { word: 'Flourish', type: 'verb', definition: 'To grow, develop or succeed strongly.', example: 'The seedlings flourished near the sunny window.' },
  { word: 'Intricate', type: 'adjective', definition: 'Made of many small and detailed parts.', example: 'The artist drew an intricate pattern.' },
  { word: 'Ponder', type: 'verb', definition: 'To think carefully about something.', example: 'We paused to ponder the final riddle.' },
  { word: 'Significant', type: 'adjective', definition: 'Important or large enough to be noticed.', example: 'The invention made a significant difference.' },
  { word: 'Versatile', type: 'adjective', definition: 'Able to be used in many different ways.', example: 'Cardboard is a versatile building material.' }
];

const FACTS = [
  { text: 'Some bamboo species can grow more than 90 centimetres in one day.', icon: '🎋' },
  { text: 'Octopuses have three hearts and blue blood.', icon: '🐙' },
  { text: 'A group of flamingos is called a flamboyance.', icon: '🦩' },
  { text: 'Honey can remain edible for thousands of years when sealed properly.', icon: '🍯' },
  { text: 'The largest living structure on Earth is the Great Barrier Reef.', icon: '🪸' },
  { text: 'A day on Venus is longer than a year on Venus.', icon: '🪐' },
  { text: 'Sea otters sometimes hold hands while sleeping so they do not drift apart.', icon: '🦦' },
  { text: 'The human brain uses about one fifth of the body’s energy.', icon: '🧠' },
  { text: 'Wombat droppings are cube-shaped.', icon: '🐾' },
  { text: 'Antarctica is the largest desert in the world.', icon: '🧊' },
  { text: 'Bananas are berries, but strawberries are not.', icon: '🍌' },
  { text: 'A bolt of lightning can heat the air to around five times the surface temperature of the Sun.', icon: '⚡' }
];

const STORAGE_KEY = 'teacherToolsDisplaySettings';
const DEFAULTS = {
  locationQuery: 'Concord NSW Australia',
  locationLabel: 'Concord, New South Wales',
  latitude: -33.8667,
  longitude: 151.1038,
  heading: 'Welcome',
  message: 'Have a wonderful day of learning.',
  showWord: true,
  showFact: true
};

function getSettings() {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
  catch { return { ...DEFAULTS }; }
}

function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function dateIndex(length) {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((now - start) / 86400000);
  return day % length;
}

function updateClock() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true }).formatToParts(now);
  const hour = parts.find((part) => part.type === 'hour')?.value || '';
  const minute = parts.find((part) => part.type === 'minute')?.value || '';
  const period = parts.find((part) => part.type === 'dayPeriod')?.value || '';
  document.getElementById('board-time').textContent = `${hour}:${minute}`;
  document.getElementById('board-period').textContent = period.toUpperCase();
  document.getElementById('board-day').textContent = new Intl.DateTimeFormat('en-AU', { weekday: 'long' }).format(now).toUpperCase();
  document.getElementById('board-date').textContent = new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }).format(now);

  const hour24 = now.getHours();
  const greeting = hour24 < 12 ? 'Good morning' : hour24 < 17 ? 'Good afternoon' : 'Good evening';
  document.getElementById('board-greeting').textContent = greeting;
}

function weatherDisplay(code) {
  const values = {
    0: ['☀️', 'Clear'], 1: ['🌤️', 'Mostly clear'], 2: ['⛅', 'Partly cloudy'], 3: ['☁️', 'Cloudy'],
    45: ['🌫️', 'Foggy'], 48: ['🌫️', 'Foggy'], 51: ['🌦️', 'Light drizzle'], 53: ['🌦️', 'Drizzle'],
    55: ['🌧️', 'Heavy drizzle'], 61: ['🌦️', 'Light rain'], 63: ['🌧️', 'Rain'], 65: ['🌧️', 'Heavy rain'],
    71: ['🌨️', 'Light snow'], 73: ['🌨️', 'Snow'], 75: ['❄️', 'Heavy snow'], 80: ['🌦️', 'Rain showers'],
    81: ['🌧️', 'Rain showers'], 82: ['⛈️', 'Heavy showers'], 95: ['⛈️', 'Thunderstorm'], 96: ['⛈️', 'Thunderstorm'], 99: ['⛈️', 'Thunderstorm']
  };
  return values[code] || ['🌤️', 'Current weather'];
}

async function geocodeLocation(query) {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.search = new URLSearchParams({ name: query, count: '1', language: 'en', format: 'json', countryCode: 'AU' }).toString();
  const response = await fetch(url);
  if (!response.ok) throw new Error('Location search failed');
  const data = await response.json();
  const result = data.results?.[0];
  if (!result) throw new Error('Location not found');
  return {
    latitude: result.latitude,
    longitude: result.longitude,
    locationQuery: query,
    locationLabel: [result.name, result.admin1].filter(Boolean).join(', ')
  };
}

async function loadWeather(settings) {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.search = new URLSearchParams({
    latitude: String(settings.latitude),
    longitude: String(settings.longitude),
    current: 'temperature_2m,apparent_temperature,weather_code',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '1'
  }).toString();

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather request failed');
    const data = await response.json();
    const [symbol, condition] = weatherDisplay(data.current.weather_code);
    document.getElementById('weather-symbol').textContent = symbol;
    document.getElementById('weather-temperature').textContent = Math.round(data.current.temperature_2m);
    document.getElementById('weather-condition').textContent = condition;
    document.getElementById('weather-feels-like').textContent = `${Math.round(data.current.apparent_temperature)}°`;
    document.getElementById('weather-range').textContent = `${Math.round(data.daily.temperature_2m_max[0])}° / ${Math.round(data.daily.temperature_2m_min[0])}°`;
    document.getElementById('weather-rain').textContent = `${Math.round(data.daily.precipitation_probability_max[0] || 0)}%`;
    document.getElementById('weather-location').textContent = settings.locationLabel;
    document.getElementById('weather-updated').textContent = `Updated ${new Intl.DateTimeFormat('en-AU', { hour: 'numeric', minute: '2-digit' }).format(new Date())}`;
  } catch (error) {
    document.getElementById('weather-condition').textContent = 'Weather unavailable';
    document.getElementById('weather-updated').textContent = 'Check the internet connection or location in settings.';
  }
}

function applyDailyContent() {
  const word = WORDS[dateIndex(WORDS.length)];
  const fact = FACTS[dateIndex(FACTS.length)];
  document.getElementById('daily-word').textContent = word.word;
  document.getElementById('daily-word-type').textContent = word.type;
  document.getElementById('daily-definition').textContent = word.definition;
  document.getElementById('daily-example').textContent = word.example;
  document.getElementById('daily-fact').textContent = fact.text;
  document.getElementById('fact-illustration').textContent = fact.icon;
}

function applySettings(settings) {
  document.getElementById('board-heading').textContent = settings.heading;
  document.getElementById('board-message').textContent = settings.message;
  document.getElementById('location-input').value = settings.locationQuery.replace(' Australia', '');
  document.getElementById('heading-input').value = settings.heading;
  document.getElementById('message-input').value = settings.message;
  document.getElementById('show-word').checked = settings.showWord;
  document.getElementById('show-fact').checked = settings.showFact;
  document.getElementById('word-widget').classList.toggle('hidden', !settings.showWord);
  document.getElementById('fact-widget').classList.toggle('hidden', !settings.showFact);
}

const definitionToggle = document.getElementById('definition-toggle');
const definitionPanel = document.getElementById('definition-panel');
definitionToggle.addEventListener('click', () => {
  const expanded = definitionToggle.getAttribute('aria-expanded') === 'true';
  definitionToggle.setAttribute('aria-expanded', String(!expanded));
  definitionPanel.hidden = expanded;
  definitionToggle.textContent = expanded ? '▣ Show definition' : '▣ Hide definition';
});

const settingsPanel = document.getElementById('board-settings');
function setSettingsOpen(open) {
  settingsPanel.classList.toggle('open', open);
  settingsPanel.setAttribute('aria-hidden', String(!open));
}
document.getElementById('settings-button').addEventListener('click', () => setSettingsOpen(true));
document.getElementById('close-settings').addEventListener('click', () => setSettingsOpen(false));

document.getElementById('fullscreen-button').addEventListener('click', async () => {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch (error) { /* browser blocked full screen */ }
});

document.getElementById('settings-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const status = document.getElementById('settings-status');
  status.textContent = 'Updating…';
  const current = getSettings();
  let locationData = {};
  const query = document.getElementById('location-input').value.trim();
  try {
    if (query && query.toLowerCase() !== current.locationQuery.replace(' Australia', '').toLowerCase()) {
      locationData = await geocodeLocation(query);
    }
    const updated = {
      ...current,
      ...locationData,
      heading: document.getElementById('heading-input').value.trim() || 'Welcome',
      message: document.getElementById('message-input').value.trim() || 'Have a wonderful day of learning.',
      showWord: document.getElementById('show-word').checked,
      showFact: document.getElementById('show-fact').checked
    };
    saveSettings(updated);
    applySettings(updated);
    await loadWeather(updated);
    status.textContent = 'Saved in this browser.';
    setTimeout(() => setSettingsOpen(false), 500);
  } catch (error) {
    status.textContent = 'That location could not be found. Try the suburb and state.';
  }
});

const settings = getSettings();
applySettings(settings);
applyDailyContent();
updateClock();
setInterval(updateClock, 1000);
loadWeather(settings);
setInterval(() => loadWeather(getSettings()), 15 * 60 * 1000);
