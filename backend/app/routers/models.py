from fastapi import APIRouter, HTTPException
from app.ml.registry import load_registry
from app.ml.schemas import ModelMetrics

router = APIRouter(prefix="/models", tags=["models"])


@router.get("/compare", response_model=list[ModelMetrics])
def compare_models():
    try:
        reg = load_registry()
    except FileNotFoundError:
        raise HTTPException(status_code=503, detail="Models not found. Run app/ml/train.py first.")

    results = []

    for name, metrics in reg["clf_metrics"].items():
        results.append(ModelMetrics(
            name=name,
            task="classification",
            acc=metrics.get("acc"),
            f1=metrics.get("f1"),
            roc_auc=metrics.get("roc_auc"),
            is_best=(name == reg["best_clf"]),
        ))

    for name, metrics in reg["reg_metrics"].items():
        results.append(ModelMetrics(
            name=name,
            task="regression",
            rmse=metrics.get("rmse"),
            r2=metrics.get("r2"),
            is_best=(name == reg["best_reg"]),
        ))

    return results


@router.get("/info")
def model_info():
    try:
        reg = load_registry()
    except FileNotFoundError:
        raise HTTPException(status_code=503, detail="Models not found. Run app/ml/train.py first.")

    return {
        "best_clf": reg["best_clf"],
        "best_reg": reg["best_reg"],
        "classifiers": list(reg["clf_metrics"].keys()),
        "regressors": list(reg["reg_metrics"].keys()),
        "feature_count": len(reg["feature_names"]),
        "features": reg["feature_names"],
    }