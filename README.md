<div align="center">

# 🌱 YieldSmart AI: Crop Yield Prediction & Fertilizer Optimization Engine
### *An End-to-End Machine Learning & Real-Time Meteorological Decision Support System for Precision Agriculture*

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-10B981?style=for-the-badge&logo=githubpages&logoColor=white)](https://tushanmahara.github.io/YieldSmart/)
[![Python](https://img.shields.io/badge/Python-3.9%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1.3-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.7.1-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.158.0-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Open-Meteo](https://img.shields.io/badge/Open--Meteo-Live_Weather_API-00599C?style=for-the-badge)](https://open-meteo.com/)
[![Git LFS](https://img.shields.io/badge/Git_LFS-Tracked-informational?style=for-the-badge&logo=gitlfs&logoColor=white)](https://git-lfs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  <a href="https://tushanmahara.github.io/YieldSmart/">🌐 <b>Live Web Demo</b></a> •
  <a href="#-project-overview">Overview</a> •
  <a href="#-key-features">Key Features</a> •
  <a href="#-system-architecture">Architecture</a> •
  <a href="#-dataset--preprocessing">Dataset & ML</a> •
  <a href="#-rest-api-reference">API Reference</a> •
  <a href="#-installation--setup-guide">Getting Started</a> •
  <a href="#-project-directory-structure">Project Tree</a> •
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
   - [Dual Deployment Architecture (Flask + GitHub Pages)](#dual-deployment-architecture-flask--github-pages)
   - [Minimal 3D Agricultural Topography Visualization](#minimal-3d-agricultural-topography-visualization)
   - [Bilingual Internationalization (EN / HI)](#bilingual-internationalization-en--hi)
7. [REST API Reference](#-rest-api-reference)
8. [Installation & Setup Guide](#-installation--setup-guide)
   - [Option 1: Full-Stack Mode (Flask + ML Models)](#option-1-full-stack-mode-recommended)
   - [Option 2: Static Server Mode](#option-2-lightweight-frontend-server-static-mode)
   - [Option 3: Retraining the ML Models](#option-3-re-train-production-ml-models)
9. [Automated Verification & Test Suite](#-automated-verification--test-suite)
10. [Project Directory Structure](#-project-directory-structure)
11. [Troubleshooting & FAQs](#-troubleshooting--faqs)
12. [Future Roadmap](#-future-roadmap)
13. [License & Acknowledgments](#-license--acknowledgments)

---

## 🌟 Executive Summary

**YieldSmart AI** is a state-of-the-art agricultural decision engine designed to solve two fundamental challenges in modern precision farming:
1. **Harvest Forecasting**: Accurately predicting crop yield (in $\text{kg/ha}$) given crop taxonomy, soil class, measured macronutrient levels ($\text{N, P, K}$), and local weather parameters.
2. **Nutrient Dosage Optimization**: Computing the exact, balanced quantities of Nitrogen ($\text{N}$), Phosphorus ($\text{P}$), and Potassium ($\text{K}$) fertilizers required to achieve a target crop yield under specific environmental conditions.

The system replaces arbitrary arithmetic heuristics with **trained scikit-learn machine learning pipelines** ($R^2 \approx 0.975$ on yield prediction and $R^2 = 1.000$ on multi-output fertilizer recommendation), backed by real-time meteorological data retrieved on-the-fly from **Open-Meteo**, and packaged inside an elegant **minimal 3D topography + Glassmorphism** bilingual web portal.

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
* **🌌 Minimal 3D Topography Wave Background**:
  GPU-accelerated ambient 3D terrain grid rendering subtle digital agricultural contours and gentle bio-spores with mouse-tracking parallax easing.
* **⚡ Dual-Mode Deployment**:
  Operates both as a full Python Flask backend service and as a standalone client-side progressive web application on GitHub Pages.
* **🛡️ Empirical Range Validation**:
  Backend and frontend guardrails that cross-reference user inputs against training dataset boundaries, alerting users when parameters exceed normal physical limits.

---

## 🏗️ System Architecture & Data Flow

```text
+---------------------------------------------------------------------------------------------------+
|                                  CLIENT BROWSER (YieldSmart SPA)                                  |
|   • Minimal 3D Topography Wave   • Bilingual Engine (EN / HI)   • Real-Time Weather Auto-Fill     |
+---------------------------------------------------------------------------------------------------+
                                                  │
                                                  │ HTTP JSON Requests (Dual Mode: Flask / Static)
                                                  ▼
+---------------------------------------------------------------------------------------------------+
|                                       PYTHON FLASK BACKEND (app.py)                               |
|                                                                                                   |
|   [Static Server]                                                                                 |
|   └── GET  /                                  ──► Serves index.html                               |
|                                                                                                   |
|   [API Layer]                                                                                     |
|   ├── GET  /api/health                        ──► Health status & loaded model verification       |
|   ├── GET  /api/feature-ranges                ──► Empirical bounds & supported categories         |
|   ├── GET  /api/metrics                       ──► Model evaluation benchmarks (R², RMSE, MAE)     |
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
* **Model**: `RandomForestRegressor(n_estimators=100)`
* **Input Vector**: $[T, H, W, N, P, K, \text{Crop\_Type}, \text{Soil\_Type}]$
* **Target**: $\text{Crop\_Yield}\ (\text{kg/ha})$
* **Performance Benchmark**:
  * **Training $R^2$**: $0.9961$
  * **Testing $R^2$**: **$0.9745$**
  * **Testing RMSE**: **$4.1266\text{ kg/ha}$**
  * **Testing MAE**: **$3.0841\text{ kg/ha}$**

---

### 2. Reverse N-P-K Optimization Model (Multi-Output)
* **Model**: `MultiOutputRegressor(RandomForestRegressor(n_estimators=100))`
* **Input Vector**: $[T, H, W, \text{Target\_Yield}, \text{Crop\_Type}, \text{Soil\_Type}]$
* **Targets**: $[\text{Nitrogen (N)}, \text{Phosphorus (P)}, \text{Potassium (K)}]$
* **Performance Benchmark**:
  * **Overall Multi-Target $R^2$**: **$1.0000$**
  * **Nitrogen $R^2$**: $1.0000$ ($\text{RMSE} = 0.04\text{ kg/ha}$)
  * **Phosphorus $R^2$**: $1.0000$ ($\text{RMSE} = 0.03\text{ kg/ha}$)
  * **Potassium $R^2$**: $1.0000$ ($\text{RMSE} = 0.02\text{ kg/ha}$)

---

## 🌐 Web Interface & User Experience

### Dual Deployment Architecture (Flask + GitHub Pages)
The web client is built with responsive vanilla CSS and native JavaScript modules, supporting two operational modes:
1. **Full-Stack Mode**: Communicates with Flask endpoints (`/api/predict`, `/api/recommend-fertilizer`, `/api/weather`).
2. **GitHub Pages Static Mode**: Automatically activates client-side ML regression calculations and direct Open-Meteo satellite weather lookups when hosted statically.

### Minimal 3D Agricultural Topography Visualization
Rendered via Three.js WebGL:
* Gentle undulating terrain grid simulating agricultural field contours.
* Soft emerald-to-mint gradient color scheme.
* Interactive camera parallax tracking subtle cursor motion.
* Ambient micro-spores drifting gently in the background.

---

## 📡 REST API Reference

### 1. Health Check
* **Endpoint**: `GET /api/health`
* **Response**:
```json
{
  "status": "online",
  "service": "AI-Powered Crop Yield & Fertilizer Optimization API",
  "models_loaded": {
    "yield_prediction": true,
    "npk_recommendation": true
  },
  "supported_crops": ["Barley", "Corn", "Cotton", "Potato", "Rice", "Soybean", "Sugarcane", "Sunflower", "Tomato", "Wheat"],
  "supported_soils": ["Clay", "Loamy", "Peaty", "Saline", "Sandy"]
}
```

---

### 2. Crop Yield Prediction
* **Endpoint**: `POST /api/predict`
* **Request Payload**:
```json
{
  "Crop_Type": "Rice",
  "Soil_Type": "Loamy",
  "Temperature": 28.0,
  "Humidity": 70.0,
  "Wind_Speed": 12.0,
  "N": 70.0,
  "P": 50.0,
  "K": 40.0
}
```
* **Response**:
```json
{
  "success": true,
  "predicted_yield": 35.62,
  "unit": "kg/ha",
  "interpretation": "Optimal harvest conditions forecast for maximum productivity.",
  "model": "Random Forest Regressor (R² ≈ 0.975)"
}
```

---

### 3. Fertilizer Recommendation
* **Endpoint**: `POST /api/recommend-fertilizer`
* **Request Payload**:
```json
{
  "Crop_Type": "Wheat",
  "Soil_Type": "Loamy",
  "Crop_Yield": 30.0,
  "Temperature": 25.0,
  "Humidity": 65.0,
  "Wind_Speed": 8.0
}
```
* **Response**:
```json
{
  "success": true,
  "recommended_NPK": {
    "N": 77.0,
    "P": 60.0,
    "K": 45.0
  },
  "unit": "kg/ha",
  "advice": "To achieve target yield of 30.0 kg/ha for Wheat in Loamy soil, apply 77.0 kg/ha Nitrogen, 60.0 kg/ha Phosphorus, and 45.0 kg/ha Potassium.",
  "model": "Multi-Output Random Forest Regressor (R² ≈ 1.000)"
}
```

---

## ⚙️ Installation & Setup Guide

### 1. Prerequisites
* **Python**: Version 3.9+ (Python 3.12 recommended)
* **Git** & **Git LFS**: Installed on your system

---

### 2. Clone the Repository
```bash
git clone https://github.com/TushanMahara/YieldSmart.git
cd YieldSmart
```

---

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

---

### Option 1: Full-Stack Mode (Recommended)
Starts the Flask server with the trained Scikit-Learn pipelines:
```bash
python app.py
```
Open your browser and navigate to:
👉 **[http://localhost:5000](http://localhost:5000)** *(or `http://127.0.0.1:5000`)*

---

### Option 2: Lightweight Frontend Server (Static Mode)
Runs the lightweight frontend server:
```bash
python -m http.server 8000
```
Open your browser and navigate to:
👉 **[http://localhost:8000](http://localhost:8000)**

---

### Option 3: Re-Train Production ML Models
To retrain both models from the raw dataset and regenerate `.pkl` artifacts in `ml/models/`:
```bash
python ml/training/train_models.py
```

---

## 🧪 Automated Verification & Test Suite

The repository includes a comprehensive verification test suite (`test_suite.py`):

```bash
python test_suite.py
```

### Verified Subsystems:
* ✅ **Module 1**: Verifies HTTP 200 status and correct MIME types for HTML, CSS, JavaScript, and background image assets.
* ✅ **Module 2**: Verifies Crop Yield prediction inference across Rice, Wheat, Corn, and Potato test samples.
* ✅ **Module 3**: Verifies Multi-Output N-P-K fertilizer recommendations across variable target yields ($30, 45, 60\text{ kg/ha}$).
* ✅ **Module 4**: Verifies live Open-Meteo weather geolocation queries for Kolkata, Delhi, London, and Tokyo.
* ✅ **Module 5**: Verifies out-of-bounds warning triggers when values exceed empirical bounds ($N = 200\text{ kg/ha}$).

---

## 📁 Project Directory Structure

```text
YieldSmart/
│
├── app.py                          # Unified Python Flask backend & static file server
├── requirements.txt                # Python project dependencies
├── .env.example                    # Environment variable configuration template
├── .gitattributes                  # Git LFS tracking configuration (*.pkl, *.mp4)
├── .gitignore                      # Git ignore patterns (.env, cache, builds)
├── .nojekyll                       # GitHub Pages Jekyll bypass flag
├── index.html                      # Root HTML5 Single Page Application
├── README.md                       # Comprehensive technical documentation
├── test_suite.py                   # Automated end-to-end test suite
│
├── css/
│   └── style.css                   # Glassmorphism design system & responsive styling
├── js/
│   ├── app.js                      # Unified frontend controller (Flask & GitHub Pages dual mode)
│   ├── three-bg.js                 # Minimal 3D agricultural topography wave background
│   └── i18n.js                     # Bilingual English & Hindi translation module
├── images/
│   └── bg.jpg                      # High-resolution agricultural backdrop asset
│
├── ml/                             # Machine Learning workspace
│   ├── models/
│   │   ├── yield_pipeline.pkl      # Production Crop Yield Random Forest Pipeline (Git LFS)
│   │   ├── reverse_yield_pipeline.pkl # Production Multi-Output NPK Recommender (Git LFS)
│   │   ├── feature_ranges.pkl      # Feature boundaries & categorical domains (Git LFS)
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
│   └── notebooks/                  # Interactive exploration & preprocessing notebooks
│       ├── Data preprocessing and training new.ipynb
│       ├── data preprocessing and training.ipynb
│       ├── data preprocessing and training_new.ipynb
│       ├── data preprocessing.ipynb
│       └── data processing.ipynb
│
├── .github/
│   └── workflows/
│       └── pages.yml               # Automated GitHub Pages CI/CD workflow
│
└── static/                         # Flask-mirrored static assets directory
    ├── index.html
    ├── css/style.css
    ├── js/app.js
    ├── js/three-bg.js
    ├── js/i18n.js
    └── images/bg.jpg
```

---

## 🛠️ Troubleshooting & FAQs

### 1. `ModuleNotFoundError: No module named 'flask'`
**Solution**: Ensure you have installed the required dependencies:
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

### 3. Git LFS Pointer vs Actual Model Binaries
**Solution**: If model files appear as small text pointers, run:
```bash
git lfs pull
git lfs checkout
```

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
