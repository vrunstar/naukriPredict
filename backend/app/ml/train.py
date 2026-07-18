import json
import joblib
import numpy as np
from pathlib import Path

from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LogisticRegression, Ridge
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score, mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

from app.ml.preprocessing import load_raw, preprocess, get_feature_columns

MODELS_DIR = Path(__file__).parent.parent.parent / "models"
MODELS_DIR.mkdir(exist_ok=True)

CLF_MODELS = {
    "random_forest": RandomForestClassifier(n_estimators=200, class_weight="balanced", random_state=67),
    "gradient_boosting": GradientBoostingClassifier(n_estimators=200, learning_rate=0.05, max_depth=4, random_state=67),
    "logistic_regression": Pipeline([
        ("scaler", StandardScaler()),
        ("clf", LogisticRegression(max_iter=1000, class_weight="balanced", random_state=67)),
    ]),
    "svm": Pipeline([
        ("scaler", StandardScaler()),
        ("clf", CalibratedClassifierCV(SVC(kernel="rbf", class_weight="balanced", probability=False, random_state=67))),
    ]),
}

REG_MODELS = {
    "random_forest": RandomForestRegressor(n_estimators=200, random_state=67),
    "gradient_boosting": GradientBoostingRegressor(n_estimators=200, learning_rate=0.05, max_depth=4, random_state=67),
    "ridge": Pipeline([
        ("scaler", StandardScaler()),
        ("reg", Ridge(alpha=1.0)),
    ]),
}


def train_and_evaluate():
    df = preprocess(load_raw())
    feature_cols = get_feature_columns(df)

    X = df[feature_cols]
    y_clf = df["placement_status"]

    X_tr, X_te, yc_tr, yc_te = train_test_split(X, y_clf, test_size=0.2, random_state=67, stratify=y_clf)

    clf_results = {}
    best_clf_name, best_clf_score, best_clf_model = None, -1, None

    print("Training classifiers...")
    for name, model in CLF_MODELS.items():
        model.fit(X_tr, yc_tr)
        proba = model.predict_proba(X_te)[:, 1]
        pred = model.predict(X_te)
        metrics = {
            "acc": round(accuracy_score(yc_te, pred), 4),
            "f1": round(f1_score(yc_te, pred, average="macro"), 4),
            "roc_auc": round(roc_auc_score(yc_te, proba), 4),
        }
        clf_results[name] = metrics
        print(f"  {name}: {metrics}")
        if metrics["roc_auc"] > best_clf_score:
            best_clf_score = metrics["roc_auc"]
            best_clf_name = name
            best_clf_model = model

    reg_results = {}
    best_reg_name, best_reg_score, best_reg_model = None, float("inf"), None

    print("\nTraining regressors (placed students only)...")
    df_placed = df[df["placement_status"] == 1]
    X_placed = df_placed[feature_cols]
    y_placed = df_placed["salary_lpa"]
    Xr_tr, Xr_te, yr_tr, yr_te = train_test_split(X_placed, y_placed, test_size=0.2, random_state=67)

    for name, model in REG_MODELS.items():
        model.fit(Xr_tr, yr_tr)
        pred = model.predict(Xr_te)
        rmse = float(np.sqrt(mean_squared_error(yr_te, pred)))
        r2 = float(r2_score(yr_te, pred))
        metrics = {"rmse": round(rmse, 4), "r2": round(r2, 4)}
        reg_results[name] = metrics
        print(f"  {name}: {metrics}")
        if rmse < best_reg_score:
            best_reg_score = rmse
            best_reg_name = name
            best_reg_model = model

    print(f"\nBest classifier: {best_clf_name} (AUC={best_clf_score:.4f})")
    print(f"Best regressor:  {best_reg_name} (RMSE={best_reg_score:.4f})")

    for name, model in CLF_MODELS.items():
        joblib.dump(model, MODELS_DIR / f"clf_{name}.pkl")
    for name, model in REG_MODELS.items():
        joblib.dump(model, MODELS_DIR / f"reg_{name}.pkl")

    registry = {
        "feature_names": list(feature_cols),
        "best_clf": best_clf_name,
        "best_reg": best_reg_name,
        "clf_metrics": clf_results,
        "reg_metrics": reg_results,
    }
    with open(MODELS_DIR / "registry.json", "w") as f:
        json.dump(registry, f, indent=2)

    print("\nAll models saved.")


if __name__ == "__main__":
    train_and_evaluate()