document.addEventListener('DOMContentLoaded', () => {
  // Auth gate
  const userRaw = localStorage.getItem('kb_user');
  if (!userRaw) {
    window.location.replace('index.html');
    return;
  }
  const user = JSON.parse(userRaw);
  const userNameEl = document.getElementById('userName');
  if (userNameEl) userNameEl.textContent = user.username || 'Farmer';
  const welcomeUser = document.getElementById('welcomeUser');
  if (welcomeUser) welcomeUser.textContent = `👤 ${user.username || 'Farmer'}`;

  // Logout
  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('kb_user');
    window.location.replace('index.html');
  });

  // Tabs
  const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
  const tabs = {
    home: document.getElementById('tab-home'),
    weather: document.getElementById('tab-weather'),
    soil: document.getElementById('tab-soil'),
    resources: document.getElementById('tab-resources')
  };
  function activateTab(tab) {
    tabButtons.forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    Object.entries(tabs).forEach(([key, el]) => el.classList.toggle('active', key === tab));
  }
  tabButtons.forEach(btn => btn.addEventListener('click', () => activateTab(btn.dataset.tab)));
  Array.from(document.querySelectorAll('[data-tab-jump]')).forEach(el => el.addEventListener('click', () => activateTab(el.getAttribute('data-tab-jump'))));

  // Mock Weather
  const getWeatherBtn = document.getElementById('getWeather');
  const weatherResult = document.getElementById('weatherResult');
  if (getWeatherBtn && weatherResult) {
    getWeatherBtn.addEventListener('click', () => {
      const loc = (document.getElementById('locInput').value || 'Your Area').trim();
      const days = mockForecast();
      weatherResult.innerHTML = days.map(d => weatherCardHTML(d)).join('');
      const rainToday = days[0].rainChance;
      document.getElementById('kpiRain').textContent = `${rainToday}%`;
    });
  }

  // Soil Diagnosis
  const diagnoseBtn = document.getElementById('diagnose');
  const soilAdvice = document.getElementById('soilAdvice');
  if (diagnoseBtn && soilAdvice) {
    diagnoseBtn.addEventListener('click', () => {
      const ph = parseFloat(document.getElementById('ph').value || '6.5');
      const moisture = parseFloat(document.getElementById('moisture').value || '40');
      const n = parseFloat(document.getElementById('n').value || '50');
      const p = parseFloat(document.getElementById('p').value || '40');
      const k = parseFloat(document.getElementById('k').value || '50');

      const analysis = analyzeSoil({ ph, moisture, n, p, k });
      document.getElementById('kpiSoil').textContent = analysis.healthLabel;
      document.getElementById('kpiCrop').textContent = analysis.suggestedCrop;
      soilAdvice.innerHTML = analysis.advice.map(a => `<span class="chip">${a}</span>`).join('');
    });
  }
});

function mockForecast() {
  const icons = ['☀️', '⛅', '☁️', '🌧️', '⛈️'];
  const out = [];
  for (let i = 0; i < 7; i++) {
    const temp = 20 + Math.round(Math.random() * 14);
    const rainChance = Math.round(Math.random() * 80);
    const icon = icons[Math.floor(Math.random() * icons.length)];
    out.push({ day: labelDay(i), temp, rainChance, icon });
  }
  return out;
}

function labelDay(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString(undefined, { weekday: 'short' });
}

function weatherCardHTML(d) {
  return `<div class="weather-card"><div>${d.day}</div><div style="font-size:26px">${d.icon}</div><div><strong>${d.temp}°C</strong></div><div>${d.rainChance}% rain</div></div>`;
}

function analyzeSoil({ ph, moisture, n, p, k }) {
  let healthScore = 0;
  if (ph >= 6 && ph <= 7.5) healthScore += 1; else healthScore -= 1;
  if (moisture >= 30 && moisture <= 60) healthScore += 1; else healthScore -= 1;
  const npkAvg = (n + p + k) / 3;
  if (npkAvg >= 40 && npkAvg <= 80) healthScore += 1; else healthScore -= 1;

  const healthLabel = healthScore >= 2 ? 'Good' : healthScore >= 1 ? 'Fair' : 'Poor';
  const crops = healthScore >= 2 ? ['Wheat', 'Maize', 'Soybean'] : healthScore >= 1 ? ['Pulses', 'Millets'] : ['Green manure', 'Legumes cover'];
  const suggestedCrop = crops[Math.floor(Math.random() * crops.length)];

  const advice = [];
  if (ph < 6) advice.push('Apply lime to raise pH');
  if (ph > 7.5) advice.push('Add organic matter to lower pH');
  if (moisture < 30) advice.push('Irrigate to reach 40–50% moisture');
  if (moisture > 60) advice.push('Improve drainage and reduce watering');
  if (npkAvg < 40) advice.push('Use balanced NPK fertilizer');
  if (npkAvg > 80) advice.push('Reduce fertilizer, risk of burn');
  if (advice.length === 0) advice.push('Soil looks healthy. Maintain with compost.');

  return { healthLabel, suggestedCrop, advice };
}




