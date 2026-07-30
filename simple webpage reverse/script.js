const form = document.getElementById("fertilizerForm");
const resultEl = document.getElementById("result");
const loader = document.getElementById("loader");
const submitBtn = document.getElementById("fertSubmit");

function showLoader(show = true) {
  loader.style.display = show ? "block" : "none";
  submitBtn.disabled = show;
}

function calculateRecommendation(cropYield) {
  return {
    N: Math.round(cropYield * 0.8),
    P: Math.round(cropYield * 0.5),
    K: Math.round(cropYield * 0.6)
  };
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

    try {
      const response = await fetch("https://cropyieldfertilizer.loca.lt/fertilizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
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
          showLoader(false);
          return;
        }
      }
    } catch (error) {
      console.warn("Remote fertilizer service unavailable, using local fallback", error);
    }

    const recommended = calculateRecommendation(payload.Crop_Yield);
    resultEl.innerHTML = `
      <div style="text-align:center;">
        <h3>🌱 Fertilizer Recommendation</h3>
        Nitrogen (N): <b>${recommended.N}</b><br>
        Phosphorus (P): <b>${recommended.P}</b><br>
        Potassium (K): <b>${recommended.K}</b>
      </div>
    `;
  } catch (error) {
    console.error(error);
    resultEl.innerHTML = "❌ Backend not working properly";
  } finally {
    showLoader(false);
  }
});