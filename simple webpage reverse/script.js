const form = document.getElementById("fertilizerForm");
const resultEl = document.getElementById("result");
const loader = document.getElementById("loader");
const submitBtn = document.getElementById("fertSubmit");

// Loader control
function showLoader(show = true) {
  loader.style.display = show ? "block" : "none";
  submitBtn.disabled = show;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  resultEl.innerHTML = "⏳ Processing...";
  showLoader(true);

  try {
    const formData = new FormData(form);

    const payload = {
      Crop_Type: formData.get("Crop_Type"),
      Soil_Type: formData.get("Soil_Type"),
      Crop_Yield: Number(formData.get("Crop_Yield"))
    };

    // 🚀 Call backend
    const response = await fetch("http://localhost:5001/fertilizer", {
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
      const { N, P, K } = data.recommended_NPK;

      resultEl.innerHTML = `
        <div style="text-align:center;">
          <h3>🌱 Fertilizer Recommendation</h3>
          Nitrogen (N): <b>${N}</b><br>
          Phosphorus (P): <b>${P}</b><br>
          Potassium (K): <b>${K}</b>
        </div>
      `;
    } else {
      throw new Error("Invalid response");
    }

  } catch (error) {
    console.error(error);
    resultEl.innerHTML = "❌ Backend not working properly";
  } finally {
    showLoader(false);
  }
});