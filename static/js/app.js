/**
 * app.js
 * Unified Frontend Controller for YieldSmart AI
 */

import { t, initI18n } from './i18n.js';
import { ThreeAgricultureScene } from './three-bg.js';

let featureRanges = {};
let currentYieldPrediction = null;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Multilingual Engine
  initI18n('en');

  // 2. Initialize 3D Agriculture Scene
  try {
    new ThreeAgricultureScene('three-container');
  } catch (err) {
    console.warn('Three.js initialization notice:', err);
  }

  // 3. Setup Tab Navigation
  setupNavigation();

  // 4. Fetch Feature Ranges & Metrics from Backend
  fetchFeatureRanges();
  fetchModelMetrics();

  // 5. Setup Form Handlers
  setupYieldForm();
  setupFertilizerForm();
  setupWeatherDashboard();
});

/* -------------------------------------------------------------
   Navigation Handling
------------------------------------------------------------- */
function setupNavigation() {
  const tabBtns = document.querySelectorAll('.nav-tab-btn, .cta-nav-btn');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = btn.getAttribute('data-tab');
      if (!targetTab) return;

      switchTab(targetTab);
    });
  });
}

export function switchTab(tabId) {
  // Update nav buttons
  document.querySelectorAll('.nav-tab-btn').forEach((btn) => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update tab panes
  document.querySelectorAll('.tab-pane').forEach((pane) => {
    if (pane.id === tabId) {
      pane.classList.add('active');
    } else {
      pane.classList.remove('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.switchTab = switchTab;

/* -------------------------------------------------------------
   Backend Metadata Fetching
------------------------------------------------------------- */
async function fetchFeatureRanges() {
  try {
    const res = await fetch('/api/feature-ranges');
    if (!res.ok) return;
    const data = await res.json();
    if (data.success && data.feature_ranges) {
      featureRanges = data.feature_ranges;
      populateDropdowns(featureRanges);
    }
  } catch (e) {
    console.warn('Could not fetch feature ranges:', e);
  }
}

function populateDropdowns(ranges) {
  const cropSelects = document.querySelectorAll('select[name="Crop_Type"]');
  const soilSelects = document.querySelectorAll('select[name="Soil_Type"]');

  if (ranges.crop_types) {
    cropSelects.forEach((select) => {
      const currentVal = select.value;
      select.innerHTML = '<option value="">-- Select Crop --</option>';
      ranges.crop_types.forEach((crop) => {
        const opt = document.createElement('option');
        opt.value = crop;
        opt.textContent = crop;
        select.appendChild(opt);
      });
      if (currentVal) select.value = currentVal;
    });
  }

  if (ranges.soil_types) {
    soilSelects.forEach((select) => {
      const currentVal = select.value;
      select.innerHTML = '<option value="">-- Select Soil --</option>';
      ranges.soil_types.forEach((soil) => {
        const opt = document.createElement('option');
        opt.value = soil;
        opt.textContent = soil;
        select.appendChild(opt);
      });
      if (currentVal) select.value = currentVal;
    });
  }
}

async function fetchModelMetrics() {
  try {
    const res = await fetch('/api/metrics');
    if (!res.ok) return;
    const data = await res.json();
    if (data.success && data.metrics) {
      updateMetricsDisplay(data.metrics);
    }
  } catch (e) {
    console.warn('Could not fetch metrics:', e);
  }
}

function updateMetricsDisplay(metrics) {
  const yieldR2El = document.getElementById('metric-yield-r2');
  const yieldRmseEl = document.getElementById('metric-yield-rmse');
  const npkR2El = document.getElementById('metric-npk-r2');

  if (yieldR2El && metrics.yield_model) {
    yieldR2El.textContent = `R²: ${metrics.yield_model.test_r2.toFixed(4)}`;
  }
  if (yieldRmseEl && metrics.yield_model) {
    yieldRmseEl.textContent = `RMSE: ${metrics.yield_model.test_rmse.toFixed(2)} kg/ha`;
  }
  if (npkR2El && metrics.npk_model) {
    npkR2El.textContent = `R²: ${metrics.npk_model.overall_test_r2.toFixed(4)}`;
  }
}

/* -------------------------------------------------------------
   Weather Auto-Fetch Helper
------------------------------------------------------------- */
async function fetchCityWeather(city) {
  if (!city || city.trim() === '') {
    throw new Error('Please enter a city name');
  }

  const res = await fetch(`/api/weather?city=${encodeURIComponent(city.trim())}`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch weather');
  }
  return data;
}

/* -------------------------------------------------------------
   1. Crop Yield Prediction Form Handler
------------------------------------------------------------- */
function setupYieldForm() {
  const form = document.getElementById('yieldForm');
  const fetchWeatherBtn = document.getElementById('btnFetchYieldWeather');
  const weatherBadge = document.getElementById('yieldWeatherBadge');
  const emptyState = document.getElementById('yieldEmptyState');
  const resultDisplay = document.getElementById('yieldResultDisplay');
  const numberEl = document.getElementById('yieldOutputNumber');
  const interpEl = document.getElementById('yieldInterpretation');
  const warningsBox = document.getElementById('yieldWarningsBox');
  const submitBtn = document.getElementById('btnYieldSubmit');
  const calcFertBtn = document.getElementById('btnCalcFertForYield');

  // Weather auto-fetch
  if (fetchWeatherBtn) {
    fetchWeatherBtn.addEventListener('click', async () => {
      const cityInput = document.getElementById('yieldCityInput');
      const city = cityInput.value;
      if (!city) {
        alert('Please enter a city name first.');
        cityInput.focus();
        return;
      }

      fetchWeatherBtn.disabled = true;
      fetchWeatherBtn.innerHTML = '<span class="spinner"></span> Fetching...';

      try {
        const data = await fetchCityWeather(city);
        const w = data.weather;
        document.querySelector('#yieldForm [name="Temperature"]').value = w.temperature;
        document.querySelector('#yieldForm [name="Humidity"]').value = w.humidity;
        document.querySelector('#yieldForm [name="Wind_Speed"]').value = w.wind_speed;

        weatherBadge.style.display = 'block';
        weatherBadge.innerHTML = `🌤️ <b>${data.city}, ${data.country}</b>: Temp ${w.temperature}°C, Humidity ${w.humidity}%, Wind ${w.wind_speed} km/h`;
      } catch (err) {
        alert(`Weather fetch failed: ${err.message}`);
      } finally {
        fetchWeatherBtn.disabled = false;
        fetchWeatherBtn.innerHTML = '⚡ Auto-Fetch Weather';
      }
    });
  }

  // Form submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const payload = {
        Crop_Type: formData.get('Crop_Type'),
        Soil_Type: formData.get('Soil_Type'),
        Temperature: parseFloat(formData.get('Temperature')),
        Humidity: parseFloat(formData.get('Humidity')),
        Wind_Speed: parseFloat(formData.get('Wind_Speed')),
        N: parseFloat(formData.get('N')),
        P: parseFloat(formData.get('P')),
        K: parseFloat(formData.get('K'))
      };

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Processing Prediction...';

      try {
        const res = await fetch('/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Prediction failed');
        }

        currentYieldPrediction = {
          yield: data.predicted_yield,
          crop: payload.Crop_Type,
          soil: payload.Soil_Type,
          temp: payload.Temperature,
          hum: payload.Humidity,
          wind: payload.Wind_Speed
        };

        emptyState.style.display = 'none';
        resultDisplay.style.display = 'block';

        animateNumber(numberEl, data.predicted_yield, 1000);
        interpEl.textContent = data.interpretation;

        if (data.warnings && data.warnings.length > 0) {
          warningsBox.style.display = 'block';
          warningsBox.innerHTML = `⚠️ <b>Note:</b><ul>${data.warnings.map((w) => `<li>${w}</li>`).join('')}</ul>`;
        } else {
          warningsBox.style.display = 'none';
        }
      } catch (err) {
        alert(`Prediction Error: ${err.message}`);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '🌾 Predict Crop Yield';
      }
    });
  }

  // Quick CTA to Fertilizer tab
  if (calcFertBtn) {
    calcFertBtn.addEventListener('click', () => {
      if (!currentYieldPrediction) return;

      switchTab('tab-fertilizer');

      const fertCrop = document.querySelector('#fertilizerForm [name="Crop_Type"]');
      const fertSoil = document.querySelector('#fertilizerForm [name="Soil_Type"]');
      const fertYield = document.querySelector('#fertilizerForm [name="Crop_Yield"]');
      const fertTemp = document.querySelector('#fertilizerForm [name="Temperature"]');
      const fertHum = document.querySelector('#fertilizerForm [name="Humidity"]');
      const fertWind = document.querySelector('#fertilizerForm [name="Wind_Speed"]');

      if (fertCrop) fertCrop.value = currentYieldPrediction.crop;
      if (fertSoil) fertSoil.value = currentYieldPrediction.soil;
      if (fertYield) fertYield.value = currentYieldPrediction.yield;
      if (fertTemp) fertTemp.value = currentYieldPrediction.temp;
      if (fertHum) fertHum.value = currentYieldPrediction.hum;
      if (fertWind) fertWind.value = currentYieldPrediction.wind;
    });
  }
}

/* -------------------------------------------------------------
   2. Fertilizer Recommendation Form Handler
------------------------------------------------------------- */
function setupFertilizerForm() {
  const form = document.getElementById('fertilizerForm');
  const fetchWeatherBtn = document.getElementById('btnFetchFertWeather');
  const weatherBadge = document.getElementById('fertWeatherBadge');
  const emptyState = document.getElementById('fertEmptyState');
  const resultDisplay = document.getElementById('fertResultDisplay');
  const nValEl = document.getElementById('fertOutputN');
  const pValEl = document.getElementById('fertOutputP');
  const kValEl = document.getElementById('fertOutputK');
  const adviceEl = document.getElementById('fertAdviceText');
  const submitBtn = document.getElementById('btnFertSubmit');

  // Weather auto-fetch
  if (fetchWeatherBtn) {
    fetchWeatherBtn.addEventListener('click', async () => {
      const cityInput = document.getElementById('fertCityInput');
      const city = cityInput.value;
      if (!city) {
        alert('Please enter a city name first.');
        cityInput.focus();
        return;
      }

      fetchWeatherBtn.disabled = true;
      fetchWeatherBtn.innerHTML = '<span class="spinner"></span> Fetching...';

      try {
        const data = await fetchCityWeather(city);
        const w = data.weather;
        document.querySelector('#fertilizerForm [name="Temperature"]').value = w.temperature;
        document.querySelector('#fertilizerForm [name="Humidity"]').value = w.humidity;
        document.querySelector('#fertilizerForm [name="Wind_Speed"]').value = w.wind_speed;

        weatherBadge.style.display = 'block';
        weatherBadge.innerHTML = `🌤️ <b>${data.city}, ${data.country}</b>: Temp ${w.temperature}°C, Humidity ${w.humidity}%, Wind ${w.wind_speed} km/h`;
      } catch (err) {
        alert(`Weather fetch failed: ${err.message}`);
      } finally {
        fetchWeatherBtn.disabled = false;
        fetchWeatherBtn.innerHTML = '⚡ Auto-Fetch Weather';
      }
    });
  }

  // Form submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const payload = {
        Crop_Type: formData.get('Crop_Type'),
        Soil_Type: formData.get('Soil_Type'),
        Crop_Yield: parseFloat(formData.get('Crop_Yield')),
        Temperature: parseFloat(formData.get('Temperature') || 25),
        Humidity: parseFloat(formData.get('Humidity') || 65),
        Wind_Speed: parseFloat(formData.get('Wind_Speed') || 10)
      };

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Computing Nutrient Plan...';

      try {
        const res = await fetch('/api/recommend-fertilizer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Fertilizer recommendation failed');
        }

        emptyState.style.display = 'none';
        resultDisplay.style.display = 'block';

        animateNumber(nValEl, data.recommended_NPK.N, 800);
        animateNumber(pValEl, data.recommended_NPK.P, 800);
        animateNumber(kValEl, data.recommended_NPK.K, 800);

        adviceEl.textContent = data.advice;
      } catch (err) {
        alert(`Recommendation Error: ${err.message}`);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '🌱 Get Scientific N-P-K Recommendation';
      }
    });
  }
}

/* -------------------------------------------------------------
   3. Live Weather Dashboard Handler
------------------------------------------------------------- */
function setupWeatherDashboard() {
  const searchBtn = document.getElementById('btnSearchWeather');
  const cityInput = document.getElementById('dashCityInput');
  const cityDisplay = document.getElementById('dashCityDisplay');
  const tempDisplay = document.getElementById('dashTempDisplay');
  const humDisplay = document.getElementById('dashHumDisplay');
  const windDisplay = document.getElementById('dashWindDisplay');
  const coordDisplay = document.getElementById('dashCoordDisplay');

  if (searchBtn && cityInput) {
    const executeSearch = async () => {
      const city = cityInput.value;
      if (!city) return;

      searchBtn.disabled = true;
      searchBtn.innerHTML = '<span class="spinner"></span>';

      try {
        const data = await fetchCityWeather(city);
        cityDisplay.textContent = `${data.city}, ${data.country}`;
        tempDisplay.textContent = `${data.weather.temperature} °C`;
        humDisplay.textContent = `${data.weather.humidity} %`;
        windDisplay.textContent = `${data.weather.wind_speed} km/h`;
        coordDisplay.textContent = `${data.latitude.toFixed(2)}°, ${data.longitude.toFixed(2)}°`;
      } catch (err) {
        alert(err.message);
      } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = 'Search Weather';
      }
    };

    searchBtn.addEventListener('click', executeSearch);
    cityInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') executeSearch();
    });
  }
}

/* -------------------------------------------------------------
   Utility: Animate Number Counter
------------------------------------------------------------- */
function animateNumber(element, target, duration = 800) {
  if (!element) return;
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = start + (target - start) * easeOut;

    element.textContent = current.toFixed(2);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toFixed(2);
    }
  }

  requestAnimationFrame(update);
}
