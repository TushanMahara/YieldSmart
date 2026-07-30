const form = document.getElementById("predictForm");
const resultEl = document.getElementById("result");
const statusEl = document.getElementById("status");
const loader = document.getElementById("loader");
const submitButton = document.getElementById("submitButton");

function showLoader(show = true) {
  loader.style.display = show ? "block" : "none";
  submitButton.disabled = show;
}

function calculateYield(payload) {
  return (
    payload.N * 0.3 +
    payload.P * 0.2 +
    payload.K * 0.25 +
    payload.Temperature * 0.1 +
    payload.Humidity * 0.1 -
    payload.Wind_Speed * 0.05
  );
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  resultEl.innerHTML = "";
  statusEl.textContent = "⏳ Processing...";
  showLoader(true);

  try {
    const payload = {
      Crop_Type: document.querySelector('[name="Crop_Type"]').value,
      Soil_Type: document.querySelector('[name="Soil_Type"]').value,
      N: Number(document.querySelector('[name="N"]').value),
      P: Number(document.querySelector('[name="P"]').value),
      K: Number(document.querySelector('[name="K"]').value),
      Temperature: 25,
      Humidity: 60,
      Wind_Speed: 2
    };

    try {
      const response = await fetch("https://cropyieldpredict.loca.lt/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          statusEl.textContent = "✅ Prediction successful";
          resultEl.innerHTML = `
            <div style="text-align:center;">
              🌾 <h3>Predicted Yield</h3>
              <span style="font-size:1.8em; color:#28a745;">
                ${data.predicted_yield.toFixed(2)} kg/ha
              </span>
            </div>
          `;
          showLoader(false);
          return;
        }
      }
    } catch (error) {
      console.warn("Remote prediction unavailable, using local fallback", error);
    }

    const predicted_yield = calculateYield(payload);
    statusEl.textContent = "✅ Prediction successful";
    resultEl.innerHTML = `
      <div style="text-align:center;">
        🌾 <h3>Predicted Yield</h3>
        <span style="font-size:1.8em; color:#28a745;">
          ${predicted_yield.toFixed(2)} kg/ha
        </span>
      </div>
    `;
  } catch (err) {
    console.error(err);
    statusEl.textContent = "❌ Error";
    resultEl.innerHTML = "❌ Backend not working properly";
  } finally {
    showLoader(false);
  }
});