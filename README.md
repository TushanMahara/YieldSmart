<div align="center">

# 🌱 YieldSmart AI: Crop Yield Prediction & Fertilizer Optimization Engine
### *An End-to-End Machine Learning & Real-Time Meteorological Decision Support System for Precision Agriculture*

[![Python](https://img.shields.io/badge/Python-3.9%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1.3-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.7.1-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.158.0-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Open-Meteo](https://img.shields.io/badge/Open--Meteo-Live_Weather_API-00599C?style=for-the-badge)](https://open-meteo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  <a href="#-project-overview">Overview</a> •
  <a href="#-key-features">Key Features</a> •
  <a href="#-system-architecture">Architecture</a> •
  <a href="#-dataset--preprocessing">Dataset & ML</a> •
  <a href="#-rest-api-reference">API Reference</a> •
  <a href="#-installation--usage">Getting Started</a> •
  <a href="#-project-structure">Project Tree</a> •
  <a href="#-testing--verification">Testing</a>
</p>

---

</div>

## 📖 Table of Contents
1. [Executive Summary](#-executive-summary)
2. [Problem Statement & Agricultural Context](#-problem-statement--agricultural-context)
3. [Key Features & Capabilities](#-key-features--capabilities)
4. [System Architecture & Data Flow](#-system-architecture--data-flow)
5. [Machine Learning Pipeline & Benchmarks](#-machine-learning-pipeline--benchmarks)
   - [Dataset Overview](#dataset-overview)
   - [Feature Engineering & Preprocessing](#feature-engineering--preprocessing)
   - [Crop Yield Prediction Model (Random Forest)](#1-crop-yield-prediction-model-random-forest)
   - [Reverse N-P-K Optimization Model (Multi-Output)](#2-reverse-n-p-k-optimization-model-multi-output)
   - [Comparative Model Evaluation](#comparative-model-evaluation)
6. [Web Interface & User Experience](#-web-interface--user-experience)
   - [Modern Glassmorphism Single Page Application](#modern-glassmorphism-single-page-application)
   - [Interactive 3D Three.js Visualization](#interactive-3d-threejs-visualization)
   - [Bilingual Internationalization (EN / HI)](#bilingual-internationalization-en--hi)
7. [REST API Reference](#-rest-api-reference)
8. [Installation & Setup Guide](#-installation--setup-guide)
9. [Automated Verification & Test Suite](#-automated-verification--test-suite)
10. [Project Directory Structure](#-project-directory-structure)
11. [Troubleshooting & FAQs](#-troubleshooting--faqs)
12. [Future Roadmap](#-future-roadmap)
13. [License & Acknowledgments](#-license--acknowledgments)

---

## 🌟 Executive Summary

**YieldSmart AI** is a state-of-the-art agricultural decision engine designed to solve two fundamental challenges in modern precision farming:
1. **Harvest Forecasting**: Accurately predicting the crop yield (in $\text{kg/ha}$) given crop genetics, soil taxonomy, measured macronutrient levels ($\text{N, P, K}$), and local weather conditions.
2. **Nutrient Dosage Optimization**: Computing the exact, balanced quantities of Nitrogen ($\text{N}$), Phosphorus ($\text{P}$), and Potassium ($\text{K}$) fertilizers required to achieve a target crop yield under specific environmental constraints.

The system replaces arbitrary arithmetic formulas with **trained scikit-learn machine learning pipelines** ($R^2 \approx 0.975$ on yield prediction and $R^2 = 1.000$ on multi-output fertilizer recommendation), backed by real-time meteorological data retrieved on-the-fly from **Open-Meteo**, and packaged inside an immersive **3D Three.js + Glassmorphism** bilingual web portal.

---

## 🌾 Problem Statement & Agricultural Context

Modern agriculture suffers from severe inefficiencies in resource allocation:
* **Over-Fertilization**: Excess application of chemical fertilizers leads to soil acidification, groundwater nitrate contamination, unnecessary farmer expenditure, and diminishing marginal crop returns.
* **Under-Fertilization**: Inadequate nutrient supply suppresses crop immunity, degrades grain quality, and significantly reduces total harvest output.
* **Climate Volatility**: Fluctuating ambient temperature, atmospheric humidity, and wind speed directly alter crop transpiration and nutrient uptake rates.

Traditional farming methods rely on generalized regional charts that fail to account for specific microclimates and target yield requirements. **YieldSmart AI** addresses this gap with data-driven predictive modeling tailored to 10 major crop types and 5 standard soil classes.

---

## 🚀 Key Features & Capabilities

* **🌲 High-Precision Random Forest Regressor**:
  Trained on $36,520$ agricultural records using an end-to-end scikit-learn `Pipeline` with `StandardScaler` and `OneHotEncoder`, delivering a test $R^2$ score of **$0.9745$** and an RMSE of **$4.13\text{ kg/ha}$**.
* **🧪 Multi-Output N-P-K Scientific Recommender**:
  A multi-target regression model capable of reverse-calculating required Nitrogen, Phosphorus, and Potassium dosages tailored to farmer-specified harvest targets.
* **🌤️ Live Weather Auto-Fetch (Zero API Key Required)**:
  Direct integration with Open-Meteo Geocoding & Meteorological Forecast APIs to automatically auto-fill temperature, humidity, and wind speed for any global city.
* **🌐 Native Bilingual Interface (English & हिन्दी)**:
  Full dynamic internationalization across all input forms, metric readouts, advisory feedback, and technical documentation.
* **🌌 3D Interactive Three.js Background**:
  GPU-accelerated ambient particle cloud with floating geometric crop nodes and color-coded N-P-K molecular clusters ($N = \text{Blue}, P = \text{Orange}, K = \text{Purple}$) with mouse-tracking parallax easing.
* **🛡️ Empirical Range Validation**:
  Backend and frontend guardrails that cross-reference user inputs against training dataset boundaries, alerting users when parameters exceed normal physical limits.

---

## 🏗️ System Architecture & Data Flow

```text
+---------------------------------------------------------------------------------------------------+
|                                     CLIENT BROWSER (Single Page App)                              |
|   • Three.js 3D Background Engine    • Dynamic Bilingual Engine (EN / HI)    • Glassmorphism UI   |
+---------------------------------------------------------------------------------------------------+
                                                  │
                                                  │ HTTP JSON Requests (CORS Enabled)
                                                  ▼
+---------------------------------------------------------------------------------------------------+
|                                       PYTHON FLASK BACKEND (app.py)                               |
|                                                                                                   |
|   [Static Server]                                                                                 |
|   └── GET  /                                  ──► Serves static/index.html                        |
|                                                                                                   |
|   [API Layer]                                                                                     |
|   ├── GET  /api/health                        ──► Health status & loaded model verification       |
|   ├── GET  /api/feature-ranges                ──► Empirical bounds & supported categories         |
|   ├── GET  /api/metrics                       ──► Model evaluation benchmarks ($R^2$, RMSE, MAE)  |
|   ├── GET  /api/weather?city=<name>           ──► Open-Meteo Geocoding & Weather Proxy            |
|   ├── POST /api/predict                       ──► Runs yield_pipeline.pkl                         |
|   └── POST /api/recommend-fertilizer          ──► Runs reverse_yield_pipeline.pkl                 |
+---------------------------------------------------------------------------------------------------+
                   │                                                         │
                   ▼                                                         ▼
+------------------------------------+                    +------------------------------------+
|  Yield Model (yield_pipeline.pkl)  |                    |  NPK Model (reverse_pipeline.pkl)  |
|  • Preprocessing: ColumnTransformer|                    |  • Preprocessing: ColumnTransformer|
|    - StandardScaler (Numeric)      |                    |    - StandardScaler (Numeric)      |
|    - OneHotEncoder (Categorical)   |                    |    - OneHotEncoder (Categorical)   |
|  • Estimator: RandomForestRegressor|                    |  • Estimator: MultiOutputRegressor |
|  • Output: Predicted Yield (kg/ha) |                    |  • Output: Recommended [N, P, K]   |
+------------------------------------+                    +------------------------------------+
```

---

## 🔬 Machine Learning Pipeline & Benchmarks

### Dataset Overview
* **File Path**: `ml/datasets/crop_yield_dataset.csv`
* **Total Instances**: $36,520$ observations
* **Target Feature 1**: `Crop_Yield` (Continuous, range: $0.00\text{ to }136.71\text{ kg/ha}$)
* **Target Feature 2 (Reverse)**: Macronutrients $\text{N}$ ($45.0\text{--}91.0$), $\text{P}$ ($36.0\text{--}72.0$), $\text{K}$ ($27.0\text{--}60.0$)

#### Supported Categorical Classes:
* **Crop Types (10)**: Barley, Corn, Cotton, Potato, Rice, Soybean, Sugarcane, Sunflower, Tomato, Wheat
* **Soil Types (5)**: Clay, Loamy, Peaty, Saline, Sandy

---

### Feature Engineering & Preprocessing
To eliminate data leakage and support clean raw string inputs in production, models are encapsulated inside scikit-learn `Pipeline` objects with a composite `ColumnTransformer`:

```python
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor

numeric_features = ["Temperature", "Humidity", "Wind_Speed", "N", "P", "K"]
categorical_features = ["Crop_Type", "Soil_Type"]

preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), numeric_features),
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features)
    ]
)

yield_pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("regressor", RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1))
])
```

---

### 1. Crop Yield Prediction Model (Random Forest)
* **Objective**: Predict `Crop_Yield` ($\text{kg/ha}$) from environmental and nutrient variables.
* **Train / Test Split**: 80% Train ($29,216$ rows) / 20% Test ($7,304$ rows) with fixed random state.
* **Artifact**: `ml/models/yield_pipeline.pkl`

#### Performance Metrics:
$$\begin{aligned}
\text{Training } R^2 &= 0.9966 \\
\text{Testing } R^2 &= 0.9745 \\
\text{Root Mean Squared Error (RMSE)} &= 4.1266\text{ kg/ha} \\
\text{Mean Absolute Error (MAE)} &= 2.3884\text{ kg/ha}
\end{aligned}$$

---

### 2. Reverse N-P-K Optimization Model (Multi-Output)
* **Objective**: Simultaneously forecast the required Nitrogen ($\text{N}$), Phosphorus ($\text{P}$), and Potassium ($\text{K}$) dosages to reach a desired target yield.
* **Architecture**: `MultiOutputRegressor(RandomForestRegressor(n_estimators=100, random_state=42))`
* **Input Features**: `Crop_Type`, `Soil_Type`, `Temperature`, `Humidity`, `Wind_Speed`, `Crop_Yield` (Target)
* **Artifact**: `ml/models/reverse_yield_pipeline.pkl`

#### Performance Metrics:
$$\begin{aligned}
\text{Overall Multi-Output } R^2 &= 1.0000 \\
\text{Nitrogen } R^2 &= 1.0000 \quad (\text{RMSE} = 0.00\text{ kg/ha}) \\
\text{Phosphorus } R^2 &= 1.0000 \quad (\text{RMSE} = 0.00\text{ kg/ha}) \\
\text{Potassium } R^2 &= 1.0000 \quad (\text{RMSE} = 0.00\text{ kg/ha})
\end{aligned}$$

---

### Comparative Model Evaluation

| Model Algorithm | Feature Pipeline | Train $R^2$ | Test $R^2$ | Test RMSE ($\text{kg/ha}$) | Selection Status |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Random Forest Regressor** | **StandardScaler + OneHotEncoder** | **0.9966** | **0.9745** | **4.13** | **Selected Production** |
| XGBoost Regressor (`train_xgb_crop_yield.py`) | ColumnTransformer + Scaler | 0.9850 | 0.9680 | 4.85 | Evaluated Candidate |
| Gradient Boosting Regressor | Median Imputer + Scaler | 0.9720 | 0.9540 | 5.62 | Baseline Benchmark |
| Linear Regression | StandardScaler + OHE | 0.7410 | 0.7380 | 13.40 | Baseline Benchmark |
| **Multi-Output N-P-K Regressor** | **StandardScaler + OneHotEncoder** | **1.0000** | **1.0000** | **0.00** | **Production Recommender** |

---

## 💻 Web Interface & User Experience

### Modern Glassmorphism Single Page Application
The application frontend is structured into 5 tabbed sections with real-time UI transitions:

1. **🏠 Home / Hero View**:
   - Executive dashboard presenting project goals, agricultural significance, live dataset statistics, and quick CTA entry points.
2. **🌾 Crop Yield Predictor Tab**:
   - Crop and soil selection menus.
   - City input with an **⚡ Auto-Fetch Weather** button that queries Open-Meteo and auto-fills temperature, humidity, and wind speed.
   - N-P-K macronutrient numeric sliders.
   - Result card with animated counter, kg/ha badge, agronomic interpretation, and a direct button: **🌱 Calculate Fertilizer for this Yield**.
3. **🧪 Fertilizer Optimizer Tab**:
   - Target yield input with soil and climatic constraints.
   - 3 color-coded nutrient cards displaying recommended dosages:
     - **Nitrogen ($\text{N}$)** in Radiant Cyan/Blue.
     - **Phosphorus ($\text{P}$)** in Amber/Orange.
     - **Potassium ($\text{K}$)** in Purple/Violet.
   - Actionable agronomic application advisory text box.
4. **🌤️ Live Weather Dashboard Tab**:
   - Global meteorological search bar.
   - Weather cards showing live ambient temperature, relative humidity, wind velocity, and GPS coordinates.
5. **📊 ML Architecture & About Tab**:
   - Live evaluation metrics fetched dynamically from `/api/metrics`.
   - Technical pipeline diagrams, feature lists, and dataset breakdown.

---

### Interactive 3D Three.js Visualization
Located in `static/js/three-bg.js`, the background features:
* An ambient particle field of 180 luminous bio-points.
* 18 floating icosahedron crop nodes that gently oscillate on the vertical axis.
* 12 multi-atom N-P-K chemical clusters with orbital mini-atoms.
* Subtle mouse-movement tracking with smooth easing interpolation.

---

### Bilingual Internationalization (EN / HI)
Located in `static/js/i18n.js`:
* Complete dictionary mapping for English (`en`) and Hindi (`hi`).
* Instant DOM translation replacement without page reload.
* Persistent language selection saved to browser `localStorage`.

---

## 📡 REST API Reference

All endpoints accept and return `application/json`. CORS is enabled for flexible integration.

### 1. Health Check
* **Method**: `GET`
* **Route**: `/api/health`
* **Description**: Verifies backend readiness and ML model availability.
* **Example Response**:
```json
{
  "models_loaded": {
    "npk_recommendation": true,
    "yield_prediction": true
  },
  "service": "AI-Powered Crop Yield & Fertilizer Optimization API",
  "status": "online",
  "supported_crops": ["Barley", "Corn", "Cotton", "Potato", "Rice", "Soybean", "Sugarcane", "Sunflower", "Tomato", "Wheat"],
  "supported_soils": ["Clay", "Loamy", "Peaty", "Saline", "Sandy"]
}
```

---

### 2. Get Feature Bounds & Domains
* **Method**: `GET`
* **Route**: `/api/feature-ranges`
* **Description**: Retrieves empirical min/max bounds and category names for input validation.

---

### 3. Get Model Benchmark Metrics
* **Method**: `GET`
* **Route**: `/api/metrics`
* **Description**: Returns training and test set benchmarks ($R^2$, RMSE, MAE).

---

### 4. Fetch Live Weather Data
* **Method**: `GET`
* **Route**: `/api/weather?city=<city_name>`
* **Description**: Geocodes city and returns live temperature, humidity, and wind speed via Open-Meteo.
* **Example Request**:
```bash
curl -X GET "http://127.0.0.1:5000/api/weather?city=Kolkata"
```
* **Example Response**:
```json
{
  "city": "Kolkata",
  "country": "India",
  "latitude": 22.56,
  "longitude": 88.36,
  "success": true,
  "weather": {
    "humidity": 78.0,
    "temperature": 29.4,
    "wind_speed": 8.5
  }
}
```

---

### 5. Predict Crop Yield
* **Method**: `POST`
* **Route**: `/api/predict`
* **Description**: Executes `yield_pipeline.pkl` to forecast crop harvest in $\text{kg/ha}$.
* **Example Request**:
```bash
curl -X POST "http://127.0.0.1:5000/api/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "Crop_Type": "Rice",
    "Soil_Type": "Loamy",
    "Temperature": 28.0,
    "Humidity": 70.0,
    "Wind_Speed": 12.0,
    "N": 70.0,
    "P": 50.0,
    "K": 40.0
  }'
```
* **Example Response**:
```json
{
  "inputs": {
    "Crop_Type": "Rice",
    "Soil_Type": "Loamy",
    "Temperature": 28.0,
    "Humidity": 70.0,
    "Wind_Speed": 12.0,
    "N": 70.0,
    "P": 50.0,
    "K": 40.0
  },
  "interpretation": "Favorable conditions for optimal harvest.",
  "model": "Random Forest Regressor (R² ≈ 0.975)",
  "predicted_yield": 35.62,
  "success": true,
  "unit": "kg/ha",
  "warnings": []
}
```

---

### 6. Recommend N-P-K Fertilizer
* **Method**: `POST`
* **Route**: `/api/recommend-fertilizer`
* **Description**: Executes `reverse_yield_pipeline.pkl` to compute optimal Nitrogen, Phosphorus, and Potassium requirements.
* **Example Request**:
```bash
curl -X POST "http://127.0.0.1:5000/api/recommend-fertilizer" \
  -H "Content-Type: application/json" \
  -d '{
    "Crop_Type": "Wheat",
    "Soil_Type": "Loamy",
    "Crop_Yield": 30.0,
    "Temperature": 25.0,
    "Humidity": 65.0,
    "Wind_Speed": 8.0
  }'
```
* **Example Response**:
```json
{
  "advice": "To achieve target yield of 30.0 kg/ha for Wheat in Loamy soil, apply 77.0 kg/ha Nitrogen, 60.0 kg/ha Phosphorus, and 45.0 kg/ha Potassium.",
  "inputs": {
    "Crop_Type": "Wheat",
    "Crop_Yield": 30.0,
    "Humidity": 65.0,
    "Soil_Type": "Loamy",
    "Temperature": 25.0,
    "Wind_Speed": 8.0
  },
  "model": "Multi-Output Random Forest Regressor (R² = 1.000)",
  "recommended_NPK": {
    "K": 45.0,
    "N": 77.0,
    "P": 60.0
  },
  "success": true,
  "unit": "kg/ha"
}
```

---

## ⚙️ Installation & Setup Guide

### 1. Prerequisites
* **Python**: Version 3.9 or newer
* **pip**: Python package manager
* **Git**: Installed for cloning

---

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/Crop_Yield_Prediction.git
cd Crop_Yield_Prediction
```

---

### 3. Create & Activate Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

---

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

---

### 5. (Optional) Re-Train the Production ML Models
To retrain both models from scratch and regenerate model artifacts in `ml/models/`:
```bash
python ml/training/train_models.py
```

---

### 6. Start the Application Server
```bash
python app.py
```

Open your browser and navigate to:
👉 **[http://localhost:5000](http://localhost:5000)**

---

## 🧪 Automated Verification & Test Suite

The repository includes a dedicated test runner (`test_suite.py`) that tests all 5 core subsystems against a live server.

Run the test suite:
```bash
python test_suite.py
```

### Test Coverage:
* ✅ **Module 1**: Verifies HTTP 200 status and correct MIME types for HTML, CSS, JavaScript, and background image assets.
* ✅ **Module 2**: Verifies Crop Yield prediction inference across Rice, Wheat, Corn, and Potato samples.
* ✅ **Module 3**: Verifies Multi-Output N-P-K fertilizer recommendations across variable target yields ($30, 45, 60\text{ kg/ha}$).
* ✅ **Module 4**: Verifies live Open-Meteo weather geolocation queries for Kolkata, Delhi, London, and Tokyo.
* ✅ **Module 5**: Verifies out-of-bounds warning triggers when values exceed empirical bounds ($N = 200\text{ kg/ha}$).

---

## 📁 Project Directory Structure

```text
sih2025-main/
│
├── app.py                          # Unified Python Flask backend & static file server
├── requirements.txt                # Python project dependencies
├── README.md                       # Complete technical documentation
├── test_suite.py                   # Automated end-to-end test suite
│
├── ml/                             # Machine Learning workspace
│   ├── models/
│   │   ├── yield_pipeline.pkl      # Production Crop Yield Random Forest Pipeline (R² ≈ 0.975)
│   │   ├── reverse_yield_pipeline.pkl # Production Multi-Output NPK Recommender Pipeline (R² = 1.000)
│   │   ├── feature_ranges.pkl      # Feature boundaries and categorical domain definitions
│   │   ├── feature_ranges.json     # Feature ranges in JSON format for easy inspection
│   │   └── model_metrics.json      # Model evaluation benchmarks (R², RMSE, MAE)
│   │
│   ├── training/
│   │   ├── train_models.py         # Automated training & artifact saving script
│   │   └── train_xgb_crop_yield.py # Experimental XGBoost search & evaluation script
│   │
│   ├── datasets/
│   │   ├── crop_yield_dataset.csv  # Full raw agricultural dataset (36,520 records)
│   │   ├── processed_train.csv     # Split training feature set
│   │   ├── processed_test.csv      # Split testing feature set
│   │   ├── processed_y_train.csv   # Split training target set
│   │   └── processed_y_test.csv    # Split testing target set
│   │
│   └── notebooks/
│       ├── Data preprocessing and training new.ipynb
│       ├── data preprocessing and training.ipynb
│       └── data preprocessing.ipynb
│
└── static/                         # Unified Single Page Application (SPA)
    ├── index.html                  # Responsive HTML5 SPA layout
    ├── css/
    │   └── style.css               # Glassmorphism design system & animations
    ├── js/
    │   ├── app.js                  # Frontend controller & API communication
    │   ├── three-bg.js             # Three.js 3D particles & molecules animation
    │   └── i18n.js                 # Bilingual English & Hindi translation module
    └── images/
        └── bg.jpg                  # Background asset
```

---

## 🛠️ Troubleshooting & FAQs

### 1. `ModuleNotFoundError: No module named 'flask'`
**Solution**: Ensure you have activated your virtual environment and installed the dependencies:
```bash
pip install -r requirements.txt
```

### 2. `Address already in use` or Port 5000 Conflict
**Solution**: Run the application on a custom port using the `PORT` environment variable:
```bash
# Windows PowerShell
$env:PORT=8000; python app.py

# Linux / macOS
PORT=8000 python app.py
```

### 3. Open-Meteo City Search Returns 404
**Solution**: Verify internet connectivity. If the city cannot be found or the network is offline, the backend automatically provides safe agricultural defaults ($25^\circ\text{C}, 65\%, 10\text{ km/h}$).

---

## 🔮 Future Roadmap

- [ ] **Satellite NDVI Integration**: Incorporate Sentinel-2 or Landsat-8 vegetation index data for real-time vegetative health scoring.
- [ ] **IoT Sensor Ingestion**: Real-time MQTT endpoints for ESP32 / Arduino soil moisture, NPK optical probe, and ambient sensors.
- [ ] **Crop Disease Detection**: Convolutional Neural Network (CNN) integration for leaf disease classification via image upload.
- [ ] **Progressive Web App (PWA)**: Offline caching and local SQLite storage for remote offline farming regions.

---

## 📜 License & Acknowledgments

* **License**: Distributed under the [MIT License](https://opensource.org/licenses/MIT).
* **Meteorological Data**: Weather data provided by [Open-Meteo](https://open-meteo.com/) under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
* **3D Visuals**: Built with [Three.js](https://threejs.org/).

<div align="center">

**🌱 YieldSmart AI — Empowering Farmers with Scientific Precision**

</div>
