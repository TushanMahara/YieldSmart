const form = document.getElementById("predictForm");
const resultEl = document.getElementById("result");
const statusEl = document.getElementById("status");
const loader = document.getElementById("loader");
const submitButton = document.getElementById("submitButton");

// Loader control
function showLoader(show = true) {
  loader.style.display = show ? "block" : "none";
  submitButton.disabled = show;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  resultEl.innerHTML = "";
  statusEl.textContent = "⏳ Processing...";
  showLoader(true);

  try {
    // 📥 Collect data
    const payload = {
      Crop_Type: document.querySelector('[name="Crop_Type"]').value,
      Soil_Type: document.querySelector('[name="Soil_Type"]').value,
      N: Number(document.querySelector('[name="N"]').value),
      P: Number(document.querySelector('[name="P"]').value),
      K: Number(document.querySelector('[name="K"]').value),

      // fixed weather values
      Temperature: 25,
      Humidity: 60,
      Wind_Speed: 2
    };

    // 🚀 Call backend
    const response = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }

    const data = await response.json();

    // ✅ Show result
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
    } else {
      throw new Error("Invalid response");
    }

  } catch (err) {
    console.error(err);
    statusEl.textContent = "❌ Error";
    resultEl.innerHTML = "❌ Backend not working properly";
  } finally {
    showLoader(false);
  }
});