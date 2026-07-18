import json
import joblib
import numpy as np
import shap
import pandas as pd
from pathlib import Path
from functools import lru_cache

from app.ml.preprocessing import load_raw, preprocess, get_feature_columns

MODELS_DIR = Path(__file__).parent.parent.parent / "models"


@lru_cache(maxsize=1)
def load_registry() -> dict:
    with open(MODELS_DIR / "registry.json") as f:
        return json.load(f)


@lru_cache(maxsize=10)
def load_clf(name: str):
    return joblib.load(MODELS_DIR / f"clf_{name}.pkl")


@lru_cache(maxsize=10)
def load_reg(name: str):
    return joblib.load(MODELS_DIR / f"reg_{name}.pkl")


def get_best_clf():
    reg = load_registry()
    return load_clf(reg["best_clf"]), reg["best_clf"]


def get_best_reg():
    reg = load_registry()
    return load_reg(reg["best_reg"]), reg["best_reg"]


def get_clf(name: str | None):
    if name is None:
        return get_best_clf()
    return load_clf(name), name


def get_reg(name: str | None):
    if name is None:
        return get_best_reg()
    return load_reg(name), name


@lru_cache(maxsize=1)
def get_background_data():
    df = preprocess(load_raw())
    feature_cols = get_feature_columns(df)
    return df[feature_cols].sample(100, random_state=42).values


def compute_shap(model, input_df, feature_names: list[str]) -> list[dict]:
    try:
        background = get_background_data()

        if hasattr(model, "named_steps"):
            scaler = model.named_steps["scaler"]
            clf = model.named_steps["clf"]
            bg_df = pd.DataFrame(background, columns=feature_names)
            in_df = pd.DataFrame(input_df, columns=feature_names)
            scaled_bg = scaler.transform(bg_df)
            scaled_input = scaler.transform(in_df)
            explainer = shap.KernelExplainer(clf.predict_proba, scaled_bg)
            values = explainer.shap_values(scaled_input, nsamples=100)
            if isinstance(values, np.ndarray) and values.ndim == 3:
                values = values[:, :, 1]
            elif isinstance(values, list):
                values = values[1]
        else:
            explainer = shap.TreeExplainer(model)
            values = explainer.shap_values(input_df)
            if isinstance(values, list):
                values = values[1]

        row = values[0]
        input_vals = np.array(input_df).flatten()

        return [
            {"feature": feature_names[i], "value": float(input_vals[i]), "shap_value": float(row[i])}
            for i in range(len(feature_names))
        ]
    except Exception as e:
        print("SHAP error:", e)
        return []