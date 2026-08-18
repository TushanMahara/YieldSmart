/**
 * i18n.js
 * Internationalization module providing bilingual support (English & Hindi)
 */

export const translations = {
  en: {
    // Navigation
    brand_title: "YieldSmart AI",
    nav_home: "Home",
    nav_predict: "Crop Yield Predictor",
    nav_fertilizer: "Fertilizer Optimizer",
    nav_weather: "Live Weather",
    nav_about: "ML Architecture & About",

    // Home / Hero
    hero_badge: "🌾 AI-Powered Agricultural Decision Engine",
    hero_title: "Precision Crop Yield Prediction & Fertilizer Optimization",
    hero_subtitle: "Harness the power of Machine Learning and real-time meteorology to forecast crop harvests and optimize N-P-K nutrient management with scientific precision.",
    cta_predict: "Predict Crop Yield",
    cta_fertilizer: "Recommend Fertilizer",
    stat_accuracy: "97.5% R² Accuracy",
    stat_rmse: "4.13 kg/ha RMSE",
    stat_records: "36,520 Dataset Records",
    stat_crops: "10 Major Crop Types",

    // Features
    feat1_title: "Random Forest Yield Forecasting",
    feat1_desc: "Trained on real agricultural datasets using robust scaling and categorical encoding to forecast harvest yield per hectare.",
    feat2_title: "Multi-Output N-P-K Recommender",
    feat2_desc: "Computes balanced Nitrogen, Phosphorus, and Potassium requirements customized to your target yield and soil condition.",
    feat3_title: "Live Open-Meteo Integration",
    feat3_desc: "Automatically extracts local temperature, atmospheric humidity, and wind velocity for precision weather-informed analysis.",
    feat4_title: "Bilingual & Farmer Friendly",
    feat4_desc: "Full support for English and Hindi with an intuitive, modern responsive interface accessible on all mobile devices.",

    // Yield Prediction Form
    form_yield_title: "Crop Yield Prediction",
    form_yield_subtitle: "Enter crop, soil, nutrient levels, and weather parameters to predict expected harvest yield.",
    label_crop_type: "Crop Type",
    label_soil_type: "Soil Type",
    label_location: "Location (City)",
    btn_fetch_weather: "Auto-Fetch Weather",
    label_temp: "Temperature",
    label_humidity: "Relative Humidity",
    label_wind: "Wind Velocity",
    label_n: "Nitrogen (N)",
    label_p: "Phosphorus (P)",
    label_k: "Potassium (K)",
    btn_predict_yield: "Predict Crop Yield",
    yield_empty_state: "Fill in agricultural parameters to generate an AI prediction.",
    yield_result_badge: "Predicted Crop Yield",
    btn_calc_fertilizer_for_yield: "🌱 Calculate Fertilizer for this Yield",

    // Fertilizer Recommender Form
    form_fert_title: "N-P-K Fertilizer Recommendation",
    form_fert_subtitle: "Input your target harvest yield and environmental parameters to receive optimal nutrient recommendations.",
    label_target_yield: "Target Crop Yield",
    btn_recommend_fert: "Get Scientific N-P-K Recommendation",
    fert_empty_state: "Enter target yield and soil conditions to generate fertilizer advice.",
    nutrient_n_title: "Nitrogen (N)",
    nutrient_p_title: "Phosphorus (P)",
    nutrient_k_title: "Potassium (K)",
    fert_advice_title: "Application Guidance",

    // Weather Dashboard
    weather_title: "Live Meteorological Dashboard",
    weather_subtitle: "Query live weather conditions from Open-Meteo for any farming region worldwide.",
    weather_search_btn: "Search Weather",
    metric_temp: "Temperature",
    metric_humidity: "Humidity",
    metric_wind: "Wind Speed",
    metric_coords: "Coordinates",

    // ML Architecture & About
    about_title: "Machine Learning Architecture & Evaluation",
    about_subtitle: "Complete technical breakdown of the trained scikit-learn models, data preprocessing pipeline, and validation benchmarks.",
    pipeline_yield_header: "1. Crop Yield Model (Random Forest Regressor)",
    pipeline_npk_header: "2. N-P-K Recommender (Multi-Output Regressor)",
    arch_flow_header: "System Architecture Flow",

    // Footer
    footer_text: "AI-Powered Crop Yield Prediction and Optimization • College Project Demonstration",
    footer_mit: "Built with scikit-learn, Python Flask, Three.js & Open-Meteo."
  },

  hi: {
    // Navigation
    brand_title: "यील्डस्मार्ट AI",
    nav_home: "मुख्य पृष्ठ",
    nav_predict: "फसल उपज अनुमान",
    nav_fertilizer: "उर्वरक अनुकूलन",
    nav_weather: "मौसम की जानकारी",
    nav_about: "ML मॉडल एवं परिचय",

    // Home / Hero
    hero_badge: "🌾 AI-आधारित कृषि निर्णय प्रणाली",
    hero_title: "सटीक फसल उपज पूर्वानुमान एवं वैज्ञानिक उर्वरक अनुशंसा",
    hero_subtitle: "मशीन लर्निंग और वास्तविक समय मौसम डेटा के उपयोग से फसल उत्पादन का सटीक अनुमान लगाएं और N-P-K पोषक तत्वों का सही संतुलन प्राप्त करें।",
    cta_predict: "उपज का अनुमान लगाएं",
    cta_fertilizer: "उर्वरक अनुशंसा प्राप्त करें",
    stat_accuracy: "97.5% R² सटीकता",
    stat_rmse: "4.13 kg/ha RMSE",
    stat_records: "36,520 डेटासेट रिकॉर्ड",
    stat_crops: "10 प्रमुख फसल प्रकार",

    // Features
    feat1_title: "रैंडम फॉरेस्ट उपज पूर्वानुमान",
    feat1_desc: "मजबूत स्केलिंग और एनकोडिंग के साथ प्रशिक्षित मॉडल जो प्रति हेक्टेयर सटीक उत्पादन का पूर्वानुमान लगाता है।",
    feat2_title: "मल्टी-आउटपुट N-P-K उर्वरक मॉडल",
    feat2_desc: "आपकी लक्षित उपज और मिट्टी की स्थिति के अनुसार नाइट्रोजन, फास्फोरस और पोटाश की आदर्श मात्रा की गणना करता है।",
    feat3_title: "लाइव ओपन-मेटियो मौसम एकीकरण",
    feat3_desc: "स्थानीय तापमान, आर्द्रता और हवा की गति को स्वतः प्राप्त कर सटीक मौसम-आधारित विश्लेषण प्रदान करता है।",
    feat4_title: "द्विभाषी एवं किसान-अनुकूल",
    feat4_desc: "हिंदी और अंग्रेजी में पूर्ण समर्थन, सभी मोबाइल और कंप्यूटर पर सुचारू रूप से कार्य करने वाला इंटरफ़ेस।",

    // Yield Prediction Form
    form_yield_title: "फसल उपज पूर्वानुमान",
    form_yield_subtitle: "फसल, मिट्टी, पोषक तत्व और मौसम की जानकारी दर्ज करें।",
    label_crop_type: "फसल का प्रकार",
    label_soil_type: "मिट्टी का प्रकार",
    label_location: "स्थान (शहर)",
    btn_fetch_weather: "मौसम स्वतः प्राप्त करें",
    label_temp: "तापमान",
    label_humidity: "आर्द्रता",
    label_wind: "हवा की गति",
    label_n: "नाइट्रोजन (N)",
    label_p: "फास्फोरस (P)",
    label_k: "पोटैशियम (K)",
    btn_predict_yield: "उपज का पूर्वानुमान लगाएं",
    yield_empty_state: "AI पूर्वानुमान उत्पन्न करने के लिए कृषि विवरण भरें।",
    yield_result_badge: "अनुमानित फसल उपज",
    btn_calc_fertilizer_for_yield: "🌱 इस उपज हेतु उर्वरक की गणना करें",

    // Fertilizer Recommender Form
    form_fert_title: "N-P-K उर्वरक अनुशंसा",
    form_fert_subtitle: "लक्षित उपज और मिट्टी दर्ज करके वैज्ञानिक उर्वरक अनुशंसा प्राप्त करें।",
    label_target_yield: "लक्षित फसल उपज",
    btn_recommend_fert: "वैज्ञानिक N-P-K अनुशंसा प्राप्त करें",
    fert_empty_state: "उर्वरक सलाह उत्पन्न करने के लिए लक्षित उपज दर्ज करें।",
    nutrient_n_title: "नाइट्रोजन (N)",
    nutrient_p_title: "फास्फोरस (P)",
    nutrient_k_title: "पोटैशियम (K)",
    fert_advice_title: "अनुप्रयोग मार्गदर्शन",

    // Weather Dashboard
    weather_title: "लाइव मौसम डैशबोर्ड",
    weather_subtitle: "विश्व के किसी भी कृषि क्षेत्र का लाइव मौसम डेटा देखें।",
    weather_search_btn: "मौसम खोजें",
    metric_temp: "तापमान",
    metric_humidity: "आर्द्रता",
    metric_wind: "हवा की गति",
    metric_coords: "भौगोलिक स्थिति",

    // ML Architecture & About
    about_title: "मशीन लर्निंग आर्किटेक्चर एवं मूल्यांकन",
    about_subtitle: "प्रशिक्षित scikit-learn मॉडल, डेटा प्रीप्रोसेसिंग पाइपलाइन और सटीकता मेट्रिक्स का तकनीकी विवरण।",
    pipeline_yield_header: "1. फसल उपज मॉडल (रैंडम फॉरेस्ट)",
    pipeline_npk_header: "2. N-P-K उर्वरक मॉडल (मल्टी-आउटपुट)",
    arch_flow_header: "सिस्टम आर्किटेक्चर प्रवाह",

    // Footer
    footer_text: "AI-आधारित फसल उपज पूर्वानुमान एवं उर्वरक अनुकूलन • कॉलेज प्रोजेक्ट",
    footer_mit: "scikit-learn, Python Flask, Three.js एवं Open-Meteo द्वारा निर्मित।"
  }
};

let currentLang = 'en';

export function t(key) {
  if (translations[currentLang] && translations[currentLang][key]) {
    return translations[currentLang][key];
  }
  if (translations['en'] && translations['en'][key]) {
    return translations['en'][key];
  }
  return key;
}

export function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem('yieldsmart_lang', lang);
    applyTranslations();
  }
}

export function getLanguage() {
  return currentLang;
}

export function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) el.setAttribute('placeholder', t(key));
  });

  const langSelect = document.getElementById('langSelect');
  if (langSelect) langSelect.value = currentLang;
}

export function initI18n(defaultLang = 'en') {
  const saved = localStorage.getItem('yieldsmart_lang') || defaultLang;
  currentLang = translations[saved] ? saved : 'en';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyTranslations();
      const sel = document.getElementById('langSelect');
      if (sel) {
        sel.value = currentLang;
        sel.addEventListener('change', (e) => setLanguage(e.target.value));
      }
    });
  } else {
    applyTranslations();
    const sel = document.getElementById('langSelect');
    if (sel) {
      sel.value = currentLang;
      sel.addEventListener('change', (e) => setLanguage(e.target.value));
    }
  }
}
