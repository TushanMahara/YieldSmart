"""
app.py
------
Production Flask API & Static Web Server for:
AI-Powered Crop Yield Prediction and Optimization.

Endpoints:
  - GET  /                           : Serves the unified web application
  - GET  /api/health                 : Health check and model readiness
  - GET  /api/feature-ranges         : Returns valid feature ranges and categories
  - GET  /api/metrics                : Returns trained ML model performance metrics
  - GET  /api/weather?city=<city>    : Fetches live weather (Temp, Humidity, Wind) via Open-Meteo
  - POST /api/predict                : Real ML prediction for Crop Yield (kg/ha)
  - POST /api/recommend-fertilizer   : Real ML multi-output recommendation for N, P, K (kg/ha)
"""

import os
import json
import joblib
import requests
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
MODELS_DIR = os.path.join(BASE_DIR, "ml", "models")

app = Flask(__name__, static_folder=STATIC_DIR)
CORS(app)

# Load Trained Models & Metadata
yield_pipeline = None
reverse_yield_pipeline = None
feature_ranges = {}
model_metrics = {}

def load_artifacts():
    global yield_pipeline, reverse_yield_pipeline, feature_ranges, model_metrics
    
    yield_model_path = os.path.join(MODELS_DIR, "yield_pipeline.pkl")
    reverse_model_path = os.path.join(MODELS_DIR, "reverse_yield_pipeline.pkl")
    ranges_path = os.path.join(MODELS_DIR, "feature_ranges.pkl")
    metrics_path = os.path.join(MODELS_DIR, "model_metrics.json")

    try:
        if os.path.exists(yield_model_path):
            yield_pipeline = joblib.load(yield_model_path)
            print("Loaded Crop Yield Pipeline successfully.")
        else:
            print(f"Warning: {yield_model_path} not found.")

        if os.path.exists(reverse_model_path):
            reverse_yield_pipeline = joblib.load(reverse_model_path)
            print("Loaded NPK Recommender Pipeline successfully.")
        else:
            print(f"Warning: {reverse_model_path} not found.")

        if os.path.exists(ranges_path):
            feature_ranges = joblib.load(ranges_path)
            print("Loaded feature ranges successfully.")
        
        if os.path.exists(metrics_path):
            with open(metrics_path, "r", encoding="utf-8") as f:
                model_metrics = json.load(f)
            print("Loaded model metrics successfully.")

    except Exception as e:
        print(f"Error loading model artifacts: {e}")

load_artifacts()


# -------------------------------------------------------------
# Static File Routes
# -------------------------------------------------------------
@app.route("/", methods=["GET"])
def index():
    return send_from_directory(STATIC_DIR, "index.html")

@app.route("/<path:path>", methods=["GET"])
def serve_static(path):
    if os.path.exists(os.path.join(STATIC_DIR, path)):
        return send_from_directory(STATIC_DIR, path)
    return send_from_directory(STATIC_DIR, "index.html")


# -------------------------------------------------------------
# API Endpoints
# -------------------------------------------------------------
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "service": "AI-Powered Crop Yield & Fertilizer Optimization API",
        "models_loaded": {
            "yield_prediction": yield_pipeline is not None,
            "npk_recommendation": reverse_yield_pipeline is not None
        },
        "supported_crops": feature_ranges.get("crop_types", []),
        "supported_soils": feature_ranges.get("soil_types", [])
    }), 200


@app.route("/api/feature-ranges", methods=["GET"])
def get_feature_ranges():
    return jsonify({
        "success": True,
        "feature_ranges": feature_ranges
    }), 200


@app.route("/api/metrics", methods=["GET"])
def get_metrics():
    return jsonify({
        "success": True,
        "metrics": model_metrics
    }), 200


@app.route("/api/weather", methods=["GET"])
def get_weather():
    city = request.args.get("city", "").strip()
    if not city:
        return jsonify({"success": False, "error": "City parameter is required."}), 400

    try:
        # Step 1: Geocoding via Open-Meteo
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=en&format=json"
        geo_resp = requests.get(geo_url, timeout=5)
        geo_data = geo_resp.json()

        if not geo_data.get("results"):
            return jsonify({
                "success": False,
                "error": f"Could not find coordinates for city '{city}'",
                "fallback": {"temperature": 25.0, "humidity": 65.0, "wind_speed": 10.0}
            }), 404

        location = geo_data["results"][0]
        lat = location["latitude"]
        lon = location["longitude"]
        city_name = location.get("name", city)
        country = location.get("country", "")

        # Step 2: Live Weather via Open-Meteo
        weather_url = (
            f"https://api.open-meteo.com/v1/forecast"
            f"?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m"
        )
        weather_resp = requests.get(weather_url, timeout=5)
        weather_data = weather_resp.json()
        current = weather_data.get("current", {})

        temp = float(current.get("temperature_2m", 25.0))
        hum = float(current.get("relative_humidity_2m", 65.0))
        wind = float(current.get("wind_speed_10m", 10.0))

        return jsonify({
            "success": True,
            "city": city_name,
            "country": country,
            "latitude": lat,
            "longitude": lon,
            "weather": {
                "temperature": round(temp, 2),
                "humidity": round(hum, 2),
                "wind_speed": round(wind, 2)
            }
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Weather API error: {str(e)}",
            "fallback": {"temperature": 25.0, "humidity": 65.0, "wind_speed": 10.0}
        }), 500


@app.route("/api/predict", methods=["POST"])
def predict_yield():
    if yield_pipeline is None:
        return jsonify({"success": False, "error": "Crop yield ML model is not loaded."}), 500

    data = request.get_json(force=True, silent=True)
    if not data:
        return jsonify({"success": False, "error": "Invalid or missing JSON payload."}), 400

    required_fields = ["Crop_Type", "Soil_Type", "Temperature", "Humidity", "Wind_Speed", "N", "P", "K"]
    missing = [f for f in required_fields if f not in data]
    if missing:
        return jsonify({"success": False, "error": f"Missing required fields: {', '.join(missing)}"}), 400

    try:
        crop_type = str(data["Crop_Type"]).strip()
        soil_type = str(data["Soil_Type"]).strip()
        temperature = float(data["Temperature"])
        humidity = float(data["Humidity"])
        wind_speed = float(data["Wind_Speed"])
        n = float(data["N"])
        p = float(data["P"])
        k = float(data["K"])

        warnings = []
        # Check empirical bounds if available
        if feature_ranges:
            if n < feature_ranges.get("N", (0, 100))[0] or n > feature_ranges.get("N", (0, 100))[1]:
                warnings.append(f"Nitrogen (N={n}) is outside empirical training bounds [{feature_ranges['N'][0]:.1f}, {feature_ranges['N'][1]:.1f}].")
            if p < feature_ranges.get("P", (0, 100))[0] or p > feature_ranges.get("P", (0, 100))[1]:
                warnings.append(f"Phosphorus (P={p}) is outside empirical training bounds [{feature_ranges['P'][0]:.1f}, {feature_ranges['P'][1]:.1f}].")
            if k < feature_ranges.get("K", (0, 100))[0] or k > feature_ranges.get("K", (0, 100))[1]:
                warnings.append(f"Potassium (K={k}) is outside empirical training bounds [{feature_ranges['K'][0]:.1f}, {feature_ranges['K'][1]:.1f}].")

        input_df = pd.DataFrame([{
            "Crop_Type": crop_type,
            "Soil_Type": soil_type,
            "Temperature": temperature,
            "Humidity": humidity,
            "Wind_Speed": wind_speed,
            "N": n,
            "P": p,
            "K": k
        }])

        prediction = yield_pipeline.predict(input_df)[0]
        # Yield should be non-negative
        predicted_yield = max(0.0, float(prediction))

        # Interpretation based on crop standards
        interpretation = "Favorable conditions for optimal harvest."
        if predicted_yield < 20.0:
            interpretation = "Low expected yield. Consider adjusting NPK balance or checking soil suitability."
        elif predicted_yield > 80.0:
            interpretation = "High expected yield. Outstanding nutrient & environmental balance!"

        return jsonify({
            "success": True,
            "predicted_yield": round(predicted_yield, 2),
            "unit": "kg/ha",
            "interpretation": interpretation,
            "model": "Random Forest Regressor (R² ≈ 0.975)",
            "warnings": warnings,
            "inputs": {
                "Crop_Type": crop_type,
                "Soil_Type": soil_type,
                "Temperature": temperature,
                "Humidity": humidity,
                "Wind_Speed": wind_speed,
                "N": n,
                "P": p,
                "K": k
            }
        }), 200

    except Exception as e:
        return jsonify({"success": False, "error": f"Prediction computation failed: {str(e)}"}), 500


@app.route("/api/recommend-fertilizer", methods=["POST"])
def recommend_fertilizer():
    if reverse_yield_pipeline is None:
        return jsonify({"success": False, "error": "NPK Recommender ML model is not loaded."}), 500

    data = request.get_json(force=True, silent=True)
    if not data:
        return jsonify({"success": False, "error": "Invalid or missing JSON payload."}), 400

    required_fields = ["Crop_Type", "Soil_Type", "Crop_Yield"]
    missing = [f for f in required_fields if f not in data]
    if missing:
        return jsonify({"success": False, "error": f"Missing required fields: {', '.join(missing)}"}), 400

    try:
        crop_type = str(data["Crop_Type"]).strip()
        soil_type = str(data["Soil_Type"]).strip()
        crop_yield = float(data["Crop_Yield"])
        
        # Environmental defaults if not supplied
        temperature = float(data.get("Temperature", 25.0))
        humidity = float(data.get("Humidity", 65.0))
        wind_speed = float(data.get("Wind_Speed", 10.0))

        if crop_yield <= 0:
            return jsonify({"success": False, "error": "Target crop yield must be greater than 0 kg/ha."}), 400

        input_df = pd.DataFrame([{
            "Crop_Type": crop_type,
            "Soil_Type": soil_type,
            "Temperature": temperature,
            "Humidity": humidity,
            "Wind_Speed": wind_speed,
            "Crop_Yield": crop_yield
        }])

        prediction = reverse_yield_pipeline.predict(input_df)[0]
        recommended_n = max(0.0, float(prediction[0]))
        recommended_p = max(0.0, float(prediction[1]))
        recommended_k = max(0.0, float(prediction[2]))

        advice = (
            f"To achieve target yield of {crop_yield} kg/ha for {crop_type} in {soil_type} soil, "
            f"apply {recommended_n:.1f} kg/ha Nitrogen, {recommended_p:.1f} kg/ha Phosphorus, and {recommended_k:.1f} kg/ha Potassium."
        )

        return jsonify({
            "success": True,
            "recommended_NPK": {
                "N": round(recommended_n, 2),
                "P": round(recommended_p, 2),
                "K": round(recommended_k, 2)
            },
            "unit": "kg/ha",
            "advice": advice,
            "model": "Multi-Output Random Forest Regressor (R² = 1.000)",
            "inputs": {
                "Crop_Type": crop_type,
                "Soil_Type": soil_type,
                "Crop_Yield": crop_yield,
                "Temperature": temperature,
                "Humidity": humidity,
                "Wind_Speed": wind_speed
            }
        }), 200

    except Exception as e:
        return jsonify({"success": False, "error": f"Fertilizer recommendation failed: {str(e)}"}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"\n=======================================================")
    print(f"  [+] YieldSmart AI Agriculture Server Running")
    print(f"  [+] Access application at: http://localhost:{port}")
    print(f"=======================================================\n")
    app.run(host="0.0.0.0", port=port, debug=False)
