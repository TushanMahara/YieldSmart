"""
train_models.py
---------------
Automated training script for AI-Powered Crop Yield Prediction and Fertilizer Optimization.

Trains and outputs:
  1. ml/models/yield_pipeline.pkl          - End-to-end Crop Yield Prediction Pipeline (Random Forest)
  2. ml/models/reverse_yield_pipeline.pkl  - End-to-end NPK Fertilizer Recommender Pipeline (MultiOutput Random Forest)
  3. ml/models/feature_ranges.pkl          - Validation bounds and categorical domain definitions
  4. ml/models/model_metrics.json          - Exact evaluation metrics (R2, RMSE, MAE)
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error

RANDOM_STATE = 42

def train_crop_yield_pipeline(df, models_dir):
    print("\n" + "="*60)
    print("1. TRAINING CROP YIELD PREDICTION PIPELINE")
    print("="*60)
    
    numeric_features = ["Temperature", "Humidity", "Wind_Speed", "N", "P", "K"]
    categorical_features = ["Crop_Type", "Soil_Type"]
    all_features = categorical_features + numeric_features
    target = "Crop_Yield"

    X = df[all_features]
    y = df[target]

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numeric_features),
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features)
        ]
    )

    yield_pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("regressor", RandomForestRegressor(n_estimators=100, random_state=RANDOM_STATE, n_jobs=-1))
    ])

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE
    )

    print(f"Training dataset size: {X_train.shape[0]} samples")
    print(f"Testing dataset size:  {X_test.shape[0]} samples")

    yield_pipeline.fit(X_train, y_train)

    # Evaluation
    y_pred_train = yield_pipeline.predict(X_train)
    y_pred_test = yield_pipeline.predict(X_test)

    r2_train = float(r2_score(y_train, y_pred_train))
    r2_test = float(r2_score(y_test, y_pred_test))
    rmse_test = float(np.sqrt(mean_squared_error(y_test, y_pred_test)))
    mae_test = float(mean_absolute_error(y_test, y_pred_test))

    print(f"Training R^2: {r2_train:.4f}")
    print(f"Testing  R^2: {r2_test:.4f}")
    print(f"Testing  RMSE: {rmse_test:.4f} kg/ha")
    print(f"Testing  MAE:  {mae_test:.4f} kg/ha")

    # Save artifact with compression for GitHub compliance (<50MB)
    output_path = os.path.join(models_dir, "yield_pipeline.pkl")
    joblib.dump(yield_pipeline, output_path, compress=3)
    print(f"Saved Crop Yield Pipeline to: {output_path}")

    return {
        "model_name": "Random Forest Regressor (Yield Prediction)",
        "features": all_features,
        "target": target,
        "train_r2": r2_train,
        "test_r2": r2_test,
        "test_rmse": rmse_test,
        "test_mae": mae_test,
        "artifact": "yield_pipeline.pkl"
    }


def train_reverse_npk_pipeline(df, models_dir):
    print("\n" + "="*60)
    print("2. TRAINING NPK FERTILIZER RECOMMENDER PIPELINE")
    print("="*60)

    # Filter out records where Crop_Yield <= 0 for realistic reverse recommendation
    df_valid = df[df["Crop_Yield"] > 0].copy()

    numeric_features = ["Temperature", "Humidity", "Wind_Speed", "Crop_Yield"]
    categorical_features = ["Crop_Type", "Soil_Type"]
    all_features = categorical_features + numeric_features
    targets = ["N", "P", "K"]

    X = df_valid[all_features]
    y = df_valid[targets]

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numeric_features),
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features)
        ]
    )

    npk_pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("regressor", MultiOutputRegressor(RandomForestRegressor(n_estimators=100, random_state=RANDOM_STATE, n_jobs=-1)))
    ])

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE
    )

    print(f"Training dataset size: {X_train.shape[0]} samples")
    print(f"Testing dataset size:  {X_test.shape[0]} samples")

    npk_pipeline.fit(X_train, y_train)

    # Evaluation
    y_pred_test = npk_pipeline.predict(X_test)
    r2_scores = r2_score(y_test, y_pred_test, multioutput="raw_values")
    overall_r2 = float(r2_score(y_test, y_pred_test))
    rmse_scores = np.sqrt(mean_squared_error(y_test, y_pred_test, multioutput="raw_values"))

    print(f"Testing R^2 Overall: {overall_r2:.4f}")
    print(f"  - Nitrogen (N)   R^2: {r2_scores[0]:.4f} | RMSE: {rmse_scores[0]:.4f} kg/ha")
    print(f"  - Phosphorus (P) R^2: {r2_scores[1]:.4f} | RMSE: {rmse_scores[1]:.4f} kg/ha")
    print(f"  - Potassium (K)  R^2: {r2_scores[2]:.4f} | RMSE: {rmse_scores[2]:.4f} kg/ha")

    output_path = os.path.join(models_dir, "reverse_yield_pipeline.pkl")
    joblib.dump(npk_pipeline, output_path)
    print(f"Saved NPK Recommender Pipeline to: {output_path}")

    return {
        "model_name": "MultiOutput Random Forest Regressor (NPK Recommendation)",
        "features": all_features,
        "targets": targets,
        "overall_test_r2": overall_r2,
        "n_r2": float(r2_scores[0]),
        "p_r2": float(r2_scores[1]),
        "k_r2": float(r2_scores[2]),
        "n_rmse": float(rmse_scores[0]),
        "p_rmse": float(rmse_scores[1]),
        "k_rmse": float(rmse_scores[2]),
        "artifact": "reverse_yield_pipeline.pkl"
    }


def compute_and_save_feature_ranges(df, models_dir):
    print("\n" + "="*60)
    print("3. COMPUTING & SAVING FEATURE RANGES & DOMAINS")
    print("="*60)

    feature_ranges = {
        "Temperature": (float(df["Temperature"].min()), float(df["Temperature"].max())),
        "Humidity": (float(df["Humidity"].min()), float(df["Humidity"].max())),
        "Wind_Speed": (float(df["Wind_Speed"].min()), float(df["Wind_Speed"].max())),
        "N": (float(df["N"].min()), float(df["N"].max())),
        "P": (float(df["P"].min()), float(df["P"].max())),
        "K": (float(df["K"].min()), float(df["K"].max())),
        "Crop_Yield": (float(df[df["Crop_Yield"] > 0]["Crop_Yield"].min()), float(df["Crop_Yield"].max())),
        "crop_types": sorted(df["Crop_Type"].dropna().unique().tolist()),
        "soil_types": sorted(df["Soil_Type"].dropna().unique().tolist())
    }

    output_path = os.path.join(models_dir, "feature_ranges.pkl")
    joblib.dump(feature_ranges, output_path)

    # Also save as JSON for easy frontend / API inspection
    json_path = os.path.join(models_dir, "feature_ranges.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(feature_ranges, f, indent=2)

    print(f"Saved feature ranges to {output_path} and {json_path}")
    print("Feature Bounds:")
    for k, v in feature_ranges.items():
        print(f"  {k}: {v}")

    return feature_ranges


def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    # Check dataset locations
    candidate_paths = [
        os.path.join(base_dir, "datasets", "crop_yield_dataset.csv"),
        os.path.join(os.path.dirname(base_dir), "crop_yield_dataset.csv"),
        os.path.join(base_dir, "crop_yield_dataset.csv")
    ]

    dataset_path = None
    for p in candidate_paths:
        if os.path.exists(p):
            dataset_path = p
            break

    if not dataset_path:
        raise FileNotFoundError(f"crop_yield_dataset.csv not found in candidate paths: {candidate_paths}")

    print(f"Loading dataset from: {dataset_path}")
    df = pd.read_csv(dataset_path)
    print(f"Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")

    models_dir = os.path.join(base_dir, "models")
    os.makedirs(models_dir, exist_ok=True)

    yield_metrics = train_crop_yield_pipeline(df, models_dir)
    npk_metrics = train_reverse_npk_pipeline(df, models_dir)
    feature_ranges = compute_and_save_feature_ranges(df, models_dir)

    metrics_summary = {
        "yield_model": yield_metrics,
        "npk_model": npk_metrics,
        "total_records": int(df.shape[0]),
        "feature_ranges": feature_ranges
    }

    metrics_path = os.path.join(models_dir, "model_metrics.json")
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics_summary, f, indent=2)

    print("\n" + "="*60)
    print("ALL PRODUCTION MODELS AND METRICS SUCCESSFULLY SAVED!")
    print("="*60)


if __name__ == "__main__":
    main()
