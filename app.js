const AU_LOCALE = 'en-AU';
const DEFAULT_LOCATION = {
  label: 'Concord, NSW',
  query: 'Concord NSW Australia',
  latitude: -33.8667,
  longitude: 151.1038
};

function updateYear() {
  document.querySelectorAll('#year').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
}

function formatClock(date) {
  return new Intl.DateTimeFormat(AU_LOCALE, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date).replace('am', 'AM').replace('pm', 'PM');
}

function weatherCodeToDisplay(code) {
  const map = {
    0: ['☀️', 'Clear'],
    1: ['🌤️', 'Mostly clear'],
    2: ['⛅', 'Partly cloudy'],
    3: ['☁️', 'Cloudy'],
    45: ['🌫️', 'Foggy'],
    48: ['🌫️', 'Foggy'],
    51: ['🌦️', 'Light drizzle'],
    53: ['🌦️', 'Drizzle'],
    55: ['🌧️', 'Heavy drizzle'],
    61: ['🌦️', 'Light rain'],
    63: ['🌧️', 'Rain'],
    65: ['🌧️', 'Heavy rain'],
    71: ['🌨️', 'Light snow'],
    73: ['🌨️', 'Snow'],
    75: ['❄️', 'Heavy snow'],
    80: ['🌦️', 'Rain showers'],
    81: ['🌧️', 'Rain showers'],
    82: ['⛈️', 'Heavy showers'],
    95: ['⛈️', 'Thunderstorm'],
    96: ['⛈️', 'Thunderstorm'],
    99: ['⛈️', 'Thunderstorm']
  };
  return map[code] || ['🌤️', 'Current weather'];
}

async function loadHomeWeather() {
  const temp = document.getElementById('home-weather-temp');
  if (!temp) return;

  const condition = document.getElementById('home-weather-condition');
  const icon = document.getElementById('home-weather-icon');
  const locationNode = document.getElementById('home-weather-location');

  try {
    const saved = JSON.parse(localStorage.getItem('teacherToolsDisplaySettings') || '{}');
    const latitude = Number(saved.latitude) || DEFAULT_LOCATION.latitude;
    const longitude = Number(saved.longitude) || DEFAULT_LOCATION.longitude;
    const label = saved.locationLabel || DEFAULT_LOCATION.label;

    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.search = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      current: 'temperature_2m,weather_code',
      timezone: 'auto'
    }).toString();

    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather request failed');
    const data = await response.json();
    const [symbol, labelText] = weatherCodeToDisplay(data.current.weather_code);

    temp.textContent = Math.round(data.current.temperature_2m);
    condition.textContent = labelText;
    icon.textContent = symbol;
    locationNode.textContent = label;
  } catch (error) {
    condition.textContent = 'Weather unavailable';
    icon.textContent = '🌤️';
  }
}

function startHomeClock() {
  const time = document.getElementById('home-time');
  const date = document.getElementById('home-date');
  if (!time || !date) return;

  const render = () => {
    const now = new Date();
    time.textContent = formatClock(now);
    date.textContent = new Intl.DateTimeFormat(AU_LOCALE, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(now);
  };
  render();
  setInterval(render, 1000);
}

function setupReportPrototype() {
  const improveButton = document.getElementById('improve-button');
  const copyButton = document.getElementById('copy-button');
  const output = document.getElementById('report-output');
  if (!improveButton || !output) return;

  improveButton.addEventListener('click', () => {
    const draft = document.getElementById('draft-comment')?.value.trim();
    if (!draft) {
      output.textContent = 'Paste a draft report comment first.';
      return;
    }
    output.textContent = 'The report-writing engine is not connected yet. This first GitHub version establishes the finished interface while the school guidelines and rewriting method are prepared.\n\nDraft comment:\n' + draft;
  });

  copyButton?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(output.innerText);
      copyButton.textContent = 'Copied';
      setTimeout(() => { copyButton.textContent = 'Copy'; }, 1200);
    } catch (error) {
      copyButton.textContent = 'Select and copy';
    }
  });
}

updateYear();
startHomeClock();
loadHomeWeather();
setupReportPrototype();
