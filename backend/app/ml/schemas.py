from pydantic import BaseModel, Field
from typing import Literal, Optional

class predReq(BaseModel):
    twelfth_pct: float = Field(..., ge=0, le=100)
    cgpa: float = Field(..., ge=0, le=10)
    backlogs: int = Field(..., ge=0)
    gender: Literal["Male", "Female", "Not choose to disclose"]
    branch: Literal["CSE", "IT", "ECE", "EE", "ME", "CE"]
    city: Literal["Tier 1", "Tier 2", "Tier 3"]
    income: Literal["0-3", "3-6", "6-10", "10-15", "15+"]
    coding: int = Field(..., ge=0, le=10)
    comms: int = Field(..., ge=0, le=10)
    aptitude: int = Field(..., ge=0, le=10)
    projects: int = Field(..., ge=0)
    internship: int = Field(..., ge=0)
    hackathon: int = Field(..., ge=0)
    extracurricular: Literal["Low", "High", "Medium"]
    part_time: Literal["Yes", "No"]
    internet: Literal["Yes", "No"]
    model: Optional[str] = None

    model_config = {"protected_namespaces": ()}

class ShapFeature(BaseModel):
    feature: str
    value: float
    shap_value: float

class predRes(BaseModel):
    placed: bool
    placement_prob: float
    pred_sal: Optional[float]
    sal_range: Optional[tuple[float, float]]
    model: str
    shap_values: list[ShapFeature]

class ModelMetrics(BaseModel):
    name: str
    task: Literal["classification", "regression"]
    acc: Optional[float] = None
    f1: Optional[float] = None
    rmse: Optional[float] = None
    roc_auc: Optional[float] = None
    r2: Optional[float] = None
    is_best: bool = False