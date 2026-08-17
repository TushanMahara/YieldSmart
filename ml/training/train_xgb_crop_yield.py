"""
Train and evaluate an XGBoost regressor for crop yield prediction.

Expected files in same directory:
 - processed_train.csv   : training features + target
 - processed_test.csv    : test features (no target)
 - processed_y_test.csv  : test target values (single column)

Outputs:
 - Prints training and testing R^2 and RMSE
 - Shows/saves feature importance plot
 - Saves the trained model to xgb_model.joblib
"""

import os
import sys
import warnings
from datetime import datetime

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.model_selection import RandomizedSearchCV, train_test_split, cross_val_score
from sklearn.metrics import r2_score, mean_squared_error
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from joblib import dump, load
import xgboost as xgb
import inspect

# Try to import xgboost, provide helpful message if not installed
try:
    from xgboost import XGBRegressor, plot_importance
except Exception as e:
    print("xgboost not found. Install with: pip install xgboost")
    raise

# For reproducibility
RANDOM_STATE = 42
np.random.seed(RANDOM_STATE)
warnings.filterwarnings("ignore", category=UserWarning)


def load_csv_maybe(filepath):
    """Load csv (handles if file doesn't contain header or has single column).
       Returns DataFrame."""
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"File not found: {filepath}")
    df = pd.read_csv(filepath)
    return df


def prepare_X_y_from_train(df_train, target_name="Crop_Yield"):
    """Detect target column and separate X,y. If target not found, assume last column is target."""
    df = df_train.copy()
    if target_name in df.columns:
        y = df[target_name].values
        X = df.drop(columns=[target_name])
    else:
        # fallback: assume last column is target
        target_col = df.columns[-1]
        print(f"Warning: '{target_name}' not in train columns. Using last column '{target_col}' as target.")
        y = df[target_col].values
        X = df.drop(columns=[target_col])
    return X, y


def prepare_test_y(df_y_test, target_name="Crop_Yield"):
    """Return 1-d numpy array of y-test values"""
    # If dataframe has single column, use that
    if target_name in df_y_test.columns:
        y_test = df_y_test[target_name].values
    elif df_y_test.shape[1] == 1:
        y_test = df_y_test.iloc[:, 0].values
    else:
        # If multiple columns, try to guess column named target or last column
        if target_name in df_y_test.columns:
            y_test = df_y_test[target_name].values
        else:
            print("Warning: processed_y_test.csv contains multiple columns; using first column as target.")
            y_test = df_y_test.iloc[:, 0].values
    return y_test


def build_preprocessor(X):
    """Build a simple preprocessor: median imputation for numeric columns.
       If categorical columns found, one-hot encode them (rare for processed data).
    """
    # For processed data, likely everything numeric. But handle columns robustly.
    numeric_cols = X.select_dtypes(include=[np.number]).columns.tolist()
    categorical_cols = X.select_dtypes(exclude=[np.number]).columns.tolist()

    transformers = []
    if numeric_cols:
        transformers.append(("num", SimpleImputer(strategy="median"), numeric_cols))
    if categorical_cols:
        from sklearn.preprocessing import OneHotEncoder
        transformers.append(("cat", Pipeline([
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("ohe", OneHotEncoder(handle_unknown="ignore", sparse=False))
        ]), categorical_cols))

    from sklearn.compose import ColumnTransformer
    preprocessor = ColumnTransformer(transformers, remainder="drop", sparse_threshold=0)
    return preprocessor


def main():
    # File paths (adjust if needed)
    train_fp = "processed_train.csv"
    test_fp = "processed_test.csv"
    ytest_fp = "processed_y_test.csv"

    print("Loading datasets ...")
    df_train = load_csv_maybe(train_fp)
    df_test = load_csv_maybe(test_fp)
    df_y_test = load_csv_maybe(ytest_fp)

    print(f"Train shape: {df_train.shape}, Test(features) shape: {df_test.shape}, y_test shape: {df_y_test.shape}")

    # Prepare X and y
    X_train_all, y_train_all = prepare_X_y_from_train(df_train, target_name="Crop_Yield")
    X_test = df_test.copy()
    y_test = prepare_test_y(df_y_test, target_name="Crop_Yield")

    # Basic sanity checks
    if X_test.shape[1] != X_train_all.shape[1]:
        print("Warning: number of features in test and train differ.")
        print(f"Train features: {X_train_all.shape[1]}, Test features: {X_test.shape[1]}")
        # Attempt to align columns by intersection/order if test has same columns
        if set(X_train_all.columns).issuperset(set(X_test.columns)):
            print("Aligning test columns to train columns (missing columns in test filled with zeros).")
            missing_cols = [c for c in X_train_all.columns if c not in X_test.columns]
            for c in missing_cols:
                X_test[c] = 0.0
            X_test = X_test[X_train_all.columns]
        else:
            # If names completely different, try to assume same order
            print("Proceeding by assuming columns correspond by order. This may be incorrect.")
            X_test = X_test.iloc[:, :X_train_all.shape[1]]
            X_test.columns = X_train_all.columns

    # Ensure indices aligned
    X_train_all = X_train_all.reset_index(drop=True)
    X_test = X_test.reset_index(drop=True)
    y_train_all = np.array(y_train_all).reshape(-1)
    y_test = np.array(y_test).reshape(-1)

    print("Building preprocessor ...")
    preprocessor = build_preprocessor(X_train_all)

    # Optionally scale numeric features for stability
    numeric_cols = X_train_all.select_dtypes(include=[np.number]).columns.tolist()
    scaler = StandardScaler()

    # But we'll create a pipeline: preprocessor -> scaler (on numeric results) -> model.
    # Because ColumnTransformer will produce all numeric after OHE, we can append StandardScaler.
    pipeline_steps = []
    pipeline_steps.append(("preprocessor", preprocessor))
    pipeline_steps.append(("scaler", StandardScaler()))
    # Model placeholder inserted later in RandomizedSearchCV

    # Split a hold-out validation from training data to be used later for early stopping.
    X_train_for_search, X_holdout, y_train_for_search, y_holdout = train_test_split(
        X_train_all, y_train_all, test_size=0.15, random_state=RANDOM_STATE
    )

    print(f"Training data for search: {X_train_for_search.shape}, holdout for final fit: {X_holdout.shape}")

    # Define the XGBRegressor (base)
    xgb_base = XGBRegressor(
        objective="reg:squarederror",
        random_state=RANDOM_STATE,
        tree_method="auto",
        verbosity=0,
        n_jobs=-1,
    )

    # Build pipeline with the model at the end
    from sklearn.pipeline import Pipeline as SKPipeline
    pipeline = SKPipeline(pipeline_steps + [("xgb", xgb_base)])

    # Hyperparameter search space (reasonable ranges)
    param_dist = {
        "xgb__n_estimators": np.arange(100, 1501, 50),                # 100..1500
        "xgb__max_depth": np.arange(3, 16, 1),                        # 3..15
        "xgb__learning_rate": [0.01, 0.02, 0.03, 0.05, 0.08, 0.1, 0.2],
        "xgb__subsample": [0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        "xgb__colsample_bytree": [0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        "xgb__reg_alpha": [0, 0.01, 0.1, 1, 5, 10],
        "xgb__reg_lambda": [0.1, 0.5, 1, 5, 10],
        "xgb__min_child_weight": [1, 3, 5, 7, 10],
        "xgb__gamma": [0, 0.01, 0.1, 0.5, 1],
    }

    # RandomizedSearchCV setup
    n_iter_search = 40  # change higher for more thorough search (longer runtime)
    search = RandomizedSearchCV(
        estimator=pipeline,
        param_distributions=param_dist,
        n_iter=n_iter_search,
        scoring="r2",            # maximize R^2
        n_jobs=-1,
        cv=3,
        verbose=2,
        random_state=RANDOM_STATE,
        refit=True
    )

    print(f"Starting RandomizedSearchCV (n_iter={n_iter_search}) ... This may take some time.")
    search.fit(X_train_for_search, y_train_for_search)

    print("RandomizedSearchCV complete.")
    print("Best CV score (R^2):", search.best_score_)
    print("Best parameters:")
    for k, v in search.best_params_.items():
        print(f"  {k}: {v}")

    # Extract best parameters for xgb and build final XGBRegressor
    best_params = search.best_params_.copy()
    # map pipeline param names like "xgb__param" to plain param
    xgb_best_params = {}
    for k, v in best_params.items():
        if k.startswith("xgb__"):
            xgb_best_params[k.replace("xgb__", "")] = v

    # For a final fit, use the holdout validation for early stopping
    print("Building final XGBRegressor with best params and training with early stopping ...")
    final_xgb = XGBRegressor(
        objective="reg:squarederror",
        random_state=RANDOM_STATE,
        n_jobs=-1,
        verbosity=1,
        **xgb_best_params
    )

    # Build final pipeline with the preprocessor + scaler + final_xgb
    # Fit final model with early stopping on holdout.
    # Some xgboost versions don't accept early_stopping via Pipeline kwargs,
    # so fit preprocessor and scaler manually, then call XGBRegressor.fit(...) with eval_set.
    early_stopping_rounds = 50
    print("Fitting preprocessor + scaler on full training data ...")
    # fit preprocessor
    preprocessor.fit(X_train_all)
    X_train_trans = preprocessor.transform(X_train_all)
    X_holdout_trans = preprocessor.transform(X_holdout)
    X_test_trans = preprocessor.transform(X_test)

    # fit scaler on transformed training data
    scaler_final = StandardScaler()
    scaler_final.fit(X_train_trans)
    X_train_scaled = scaler_final.transform(X_train_trans)
    X_holdout_scaled = scaler_final.transform(X_holdout_trans)
    X_test_scaled = scaler_final.transform(X_test_trans)

    # Replace the existing final_xgb.fit(...) call (the call that used early_stopping_rounds)
    # with the compatibility wrapper below.

    # prepare common fit arguments used previously (keep the same eval_set/eval_metric/verbose you used)
    fit_kwargs = {
        # ...existing code...
        # replace the X/y/eval_set keys with whatever variables are used in the original call
        # example placeholders below — keep the original variable names from your file:
        "X": processed_train,
        "y": y_train_final,
        "eval_set": [(X_holdout, y_holdout)],
        "eval_metric": "rmse",
        "verbose": True,
    }

    # detect whether early_stopping_rounds is accepted; otherwise use callback API
    sig = inspect.signature(final_xgb.fit)
    if "early_stopping_rounds" in sig.parameters:
        fit_kwargs["early_stopping_rounds"] = 50
    else:
        fit_kwargs["callbacks"] = [xgb.callback.EarlyStopping(rounds=50, metric_name="rmse")]

    final_xgb.fit(**fit_kwargs)

    # Build final pipeline object (components already fitted) for convenience in predict/save
    final_pipeline = SKPipeline([("preprocessor", preprocessor), ("scaler", scaler_final), ("xgb", final_xgb)])

    # Predictions
    print("Predicting on training and test sets ...")
    y_train_pred = final_pipeline.predict(X_train_all)
    y_test_pred = final_pipeline.predict(X_test)

    # Metrics
    def rmse(a, b):
        return np.sqrt(mean_squared_error(a, b))

    r2_train = r2_score(y_train_all, y_train_pred)
    rmse_train = rmse(y_train_all, y_train_pred)

    r2_test = r2_score(y_test, y_test_pred)
    rmse_test = rmse(y_test, y_test_pred)

    print("\nModel performance:")
    print(f"Training   R^2  : {r2_train:.6f}")
    print(f"Training   RMSE: {rmse_train:.6f}")
    print(f"Testing    R^2  : {r2_test:.6f}")
    print(f"Testing    RMSE: {rmse_test:.6f}")

    # Cross-validated R^2 on training set (optional)
    print("\nCross-validating best pipeline on training data (3-fold R^2)...")
    try:
        cv_scores = cross_val_score(final_pipeline, X_train_all, y_train_all, cv=3, scoring="r2", n_jobs=-1)
        print(f"CV R^2 scores: {cv_scores}")
        print(f"Mean CV R^2: {np.mean(cv_scores):.6f} (+/- {np.std(cv_scores):.6f})")
    except Exception as e:
        print("Cross-validation failed:", str(e))

    # Feature importance plot
    print("\nPlotting feature importance ...")
    # Extract underlying trained XGBoost booster and feature names
    # To get feature names, we must transform the preprocessor to obtain final feature names after OHE (if any)
    # Build feature names from preprocessor
    try:
        # Get fitted preprocessor step
        fitted_preprocessor = final_pipeline.named_steps["preprocessor"]
        # We'll transform a single row to get number of output features and match names if possible
        # For numeric columns, names remain same. For OneHotEncoder, we need to get categories_ to construct names.
        feature_names = []

        # If ColumnTransformer is used, inspect its transformers_
        if hasattr(fitted_preprocessor, "transformers_"):
            for name, trans, cols in fitted_preprocessor.transformers_:
                if name == "remainder":
                    continue
                if trans == "drop":
                    continue
                if hasattr(trans, "named_steps"):
                    # pipeline: imputer + ohe
                    if "ohe" in trans.named_steps:
                        ohe = trans.named_steps["ohe"]
                        imputer = trans.named_steps.get("imputer", None)
                        # build names from ohe
                        if hasattr(ohe, "categories_"):
                            for i, col in enumerate(cols):
                                cats = ohe.categories_[i]
                                for cat in cats:
                                    feature_names.append(f"{col}__{cat}")
                        else:
                            # fallback
                            feature_names.extend([f"{c}" for c in cols])
                    else:
                        # numeric pipeline: keep original names
                        feature_names.extend([f"{c}" for c in cols])
                else:
                    # trans is SimpleImputer for numeric
                    feature_names.extend([f"{c}" for c in cols])
        else:
            # Fallback: use original columns
            feature_names = list(X_train_all.columns)

        # After preprocessor, scaler does not change names; now XGB sees features in this order.
        booster = final_pipeline.named_steps["xgb"].get_booster()
        # plot_importance accepts booster
        fig, ax = plt.subplots(figsize=(10, 12))
        # We can use plot_importance - but to show names we need to map feature indices to names.
        try:
            # Create importance dict
            importance_dict = final_pipeline.named_steps["xgb"].get_booster().get_score(importance_type="weight")
            # Convert to (feature, importance) and sort
            # importance keys are like 'f0', 'f1', ...
            imp_items = []
            for k, v in importance_dict.items():
                if k.startswith("f"):
                    idx = int(k[1:])
                    name = feature_names[idx] if idx < len(feature_names) else k
                    imp_items.append((name, v))
                else:
                    imp_items.append((k, v))
            imp_items = sorted(imp_items, key=lambda x: x[1], reverse=True)
            names = [x[0] for x in imp_items]
            vals = [x[1] for x in imp_items]
            if len(names) == 0:
                raise ValueError("No importance info available")
            ax.barh(range(len(names)), vals[::-1], align="center")
            ax.set_yticks(range(len(names)))
            ax.set_yticklabels(names[::-1], fontsize=8)
            ax.set_xlabel("Feature importance (weight)")
            ax.set_title("XGBoost feature importance")
            plt.tight_layout()
            plt.show()
        except Exception:
            # fallback to xgboost built-in plot_importance
            plot_importance(booster, max_num_features=30, height=0.6)
            plt.show()
    except Exception as e:
        print("Could not compute feature importance plot:", str(e))

    # Save trained model and pipeline
    model_output_path = "xgb_pipeline.joblib"
    print(f"Saving final pipeline to {model_output_path}")
    dump(final_pipeline, model_output_path)

    print("Done.")


if __name__ == "__main__":
    main()