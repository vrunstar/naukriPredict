from fastapi import APIRouter, HTTPException
from app.ml.schemas import predReq, predRes, ShapFeature
from app.ml.registry import get_clf, get_reg, load_registry, compute_shap
from app.ml.preprocessing import build_input_row

router = APIRouter(prefix="/predict", tags=["predict"])


@router.post("", response_model=predRes)
def predict(req: predReq):
    try:
        registry = load_registry()
        feature_names = registry["feature_names"]

        clf, clf_name = get_clf(req.model)
        input_df = build_input_row(req)[feature_names]

        placement_prob = float(clf.predict_proba(input_df)[0][1])
        placed = bool(clf.predict(input_df)[0])

        shap_raw = compute_shap(clf, input_df.values, feature_names)
        shap_values = [ShapFeature(**s) for s in shap_raw]

        salary = None
        sal_range = None

        if placed:
            reg, _ = get_reg(None)
            salary = float(reg.predict(input_df)[0])
            sal_range = (round(salary - 1.5, 2), round(salary + 1.5, 2))

        return predRes(
            placed=placed,
            placement_prob=round(placement_prob, 4),
            pred_sal=round(salary, 2) if salary else None,
            sal_range=sal_range,
            model=clf_name,
            shap_values=shap_values,
        )
    except FileNotFoundError as e:
        if req.model and req.model not in load_registry().get("clf_metrics", {}):
            raise HTTPException(status_code=400, detail=f"Unknown model: {req.model}")
        raise HTTPException(status_code=503, detail="Models not found. Run app/ml/train.py first.")
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Unknown model: {e}")