export const translations = {
  en: {
    title_predict: "🌱 YieldSmart Crop Yield Prediction",
    cropType: "Crop Type",
    soilType: "Soil Type",
    nLabel: "N (Nitrogen)",
    pLabel: "P (Phosphorus)",
    kLabel: "K (Potassium)",
    locationLabel: "Location (City)",
    predictButton: "Predict Yield",
    status_default: "Enter details and click Predict Yield. The app will fetch current weather automatically.",
    processing: "⏳ Processing... Please wait.",
    fill_error: "❌ Please fill all fields correctly.",
    weather_note_default: "Using default weather values.",
    link_fertiliser: "Click here to get Fertiliser recommendation",
    title_fert: "🌾 YieldSmart Fertilizer Recommendation",
    fert_location: "Location",
    fert_crop: "Crop Type",
    fert_soil: "Soil Type",
    fert_yield: "Crop Yield (kg/ha)",
    fert_button: "Get Recommendation",
    go_to_predict: "Go to Crop Yield Prediction page",
    rec_received: "✅ Recommendation:",
    rec_backend_error: "❌ Backend error:",
    request_failed: "❌ Request failed:"
  },
  hi: {
    title_predict: "🌱 YieldSmart फसल उपज अनुमान",
    cropType: "फसल प्रकार",
    soilType: "मृदा प्रकार",
    nLabel: "N (नाइट्रोजन)",
    pLabel: "P (फ़ॉस्फ़ोरस)",
    kLabel: "K (पोटैशियम)",
    locationLabel: "स्थान (शहर)",
    predictButton: "उपज अनुमानित करें",
    status_default: "विवरण भरें और 'उपज अनुमानित करें' पर क्लिक करें। ऐप स्वतः मौसम लाएगा।",
    processing: "⏳ प्रक्रम चालू... कृपया प्रतीक्षा करें।",
    fill_error: "❌ कृपया सभी फील्ड सही भरें।",
    weather_note_default: "डिफ़ॉल्ट मौसम मान उपयोग कर रहा है।",
    link_fertiliser: "उर्वरक अनुशंसा पाने के लिए यहाँ क्लिक करें",
    title_fert: "🌾 YieldSmart उर्वरक अनुशंसा उपकरण",
    fert_location: "स्थान",
    fert_crop: "फसल प्रकार",
    fert_soil: "मृदा प्रकार",
    fert_yield: "फसल उपज (किग्रा/हेक्टेयर)",
    fert_button: "अनुशंसा प्राप्त करें",
    go_to_predict: "फसल उपज अनुमान पृष्ठ पर जाएं",
    rec_received: "✅ अनुशंसा:",
    rec_backend_error: "❌ बैकएंड त्रुटि:",
    request_failed: "❌ अनुरोध विफल:"
  }
};

let current = "en";

export function t(key, vars = {}) {
  const txt =
    (translations[current] && translations[current][key]) ||
    (translations["en"] && translations["en"][key]) ||
    key;
  return String(txt).replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? "");
}

export function setLanguage(lang) {
  if (translations[lang]) {
    current = lang;
    applyToDom();
  }
}

export function getLanguage() {
  return current;
}

export function applyToDom() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key) el.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (key) el.setAttribute("placeholder", t(key));
  });

  document.querySelectorAll("[data-i18n-value]").forEach((el) => {
    const key = el.getAttribute("data-i18n-value");
    if (key) el.value = t(key);
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    if (key) el.innerHTML = t(key);
  });

  const sel = document.getElementById("langSelect");
  if (sel) sel.value = current;
}

/**
 * init(defaultLang) - call once from module pages.
 */
export function init(defaultLang = "en") {
  if (translations[defaultLang]) current = defaultLang;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      applyToDom();
      const sel = document.getElementById("langSelect");
      if (sel) {
        sel.value = current;
        sel.addEventListener("change", (ev) => setLanguage(ev.target.value));
      }
    });
  } else {
    applyToDom();
    const sel = document.getElementById("langSelect");
    if (sel) {
      sel.value = current;
      sel.addEventListener("change", (ev) => setLanguage(ev.target.value));
    }
  }
}