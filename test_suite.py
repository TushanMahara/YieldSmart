"""
test_suite.py
--------------
Comprehensive validation test suite for YieldSmart AI.
"""

import sys
import io
import requests

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
base = 'http://127.0.0.1:5000'

files_to_check = [
    '/',
    '/css/style.css',
    '/js/app.js',
    '/js/three-bg.js',
    '/js/i18n.js',
    '/images/bg.jpg'
]

print("=== 1. VERIFYING ALL STATIC ASSETS ===")
for f in files_to_check:
    r = requests.get(f"{base}{f}")
    print(f"Asset {f:20} -> Status: {r.status_code}, Length: {len(r.content)} bytes, Content-Type: {r.headers.get('Content-Type')}")
    assert r.status_code == 200, f"Failed to load {f}"

print("\n=== 2. COMPREHENSIVE PREDICTION TEST SUITE ===")
test_cases = [
    {"Crop_Type": "Rice", "Soil_Type": "Loamy", "Temperature": 28.0, "Humidity": 70.0, "Wind_Speed": 12.0, "N": 70.0, "P": 50.0, "K": 40.0},
    {"Crop_Type": "Wheat", "Soil_Type": "Peaty", "Temperature": 20.0, "Humidity": 65.0, "Wind_Speed": 8.0, "N": 60.5, "P": 45.0, "K": 31.5},
    {"Crop_Type": "Corn", "Soil_Type": "Clay", "Temperature": 22.0, "Humidity": 75.0, "Wind_Speed": 14.0, "N": 84.0, "P": 66.0, "K": 50.0},
    {"Crop_Type": "Potato", "Soil_Type": "Sandy", "Temperature": 18.0, "Humidity": 80.0, "Wind_Speed": 10.0, "N": 55.0, "P": 40.0, "K": 30.0}
]

for tc in test_cases:
    r = requests.post(f"{base}/api/predict", json=tc)
    data = r.json()
    print(f"Crop: {tc['Crop_Type']:8} | Soil: {tc['Soil_Type']:6} | Predicted Yield: {data['predicted_yield']:6.2f} kg/ha | Model: {data['model']}")
    assert r.status_code == 200
    assert data["success"] is True
    assert data["predicted_yield"] > 0

print("\n=== 3. COMPREHENSIVE FERTILIZER RECOMMENDATION TEST SUITE ===")
fert_test_cases = [
    {"Crop_Type": "Wheat", "Soil_Type": "Loamy", "Crop_Yield": 30.0, "Temperature": 25.0, "Humidity": 65.0, "Wind_Speed": 8.0},
    {"Crop_Type": "Rice", "Soil_Type": "Clay", "Crop_Yield": 45.0, "Temperature": 28.0, "Humidity": 75.0, "Wind_Speed": 10.0},
    {"Crop_Type": "Corn", "Soil_Type": "Sandy", "Crop_Yield": 60.0, "Temperature": 24.0, "Humidity": 60.0, "Wind_Speed": 12.0}
]

for tc in fert_test_cases:
    r = requests.post(f"{base}/api/recommend-fertilizer", json=tc)
    data = r.json()
    npk = data["recommended_NPK"]
    print(f"Crop: {tc['Crop_Type']:8} | Target Yield: {tc['Crop_Yield']:4.1f} kg/ha -> N: {npk['N']:5.1f} | P: {npk['P']:5.1f} | K: {npk['K']:5.1f} kg/ha")
    assert r.status_code == 200
    assert data["success"] is True
    assert npk["N"] > 0 and npk["P"] > 0 and npk["K"] > 0

print("\n=== 4. LIVE WEATHER GEOLOCATION TEST SUITE ===")
cities = ["Kolkata", "Delhi", "London", "Tokyo"]
for city in cities:
    r = requests.get(f"{base}/api/weather?city={city}")
    data = r.json()
    w = data["weather"]
    print(f"City: {data['city']:10} | Country: {data['country']:12} | Temp: {w['temperature']:5.1f} °C | Hum: {w['humidity']:4.1f} % | Wind: {w['wind_speed']:4.1f} km/h")
    assert r.status_code == 200
    assert data["success"] is True

print("\n=== 5. RANGE VALIDATION & WARNINGS TEST ===")
out_of_bounds_test = {
    "Crop_Type": "Rice",
    "Soil_Type": "Loamy",
    "Temperature": 28.0,
    "Humidity": 70.0,
    "Wind_Speed": 12.0,
    "N": 200.0, # Extreme N
    "P": 50.0,
    "K": 40.0
}
r = requests.post(f"{base}/api/predict", json=out_of_bounds_test)
data = r.json()
print("Out-of-bounds warning detected:", data.get("warnings"))
assert len(data.get("warnings", [])) > 0

print("\n🎉 ALL 5 TEST MODULES PASSED WITH 100% SUCCESS!")
