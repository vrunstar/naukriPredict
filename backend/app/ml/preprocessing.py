import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent.parent / "data"
BRANCHES = ["CSE", "IT", "ECE", "EE", "ME", "CE"]

ORD_MAPS = {
    "gender": {"Male": 1, "Female": 0, "Not choose to disclose": 2},
    "part_time_job": {"Yes": 1, "No": 0},
    "internet_access": {"Yes": 1, "No": 0},
    "family_income_level": {"Low": 1, "Medium": 2, "High": 3},
    "city_tier": {"Tier 1": 1, "Tier 2": 2, "Tier 3": 3},
    "extracurricular_involvement": {"Low": 1, "Medium": 2, "High": 3},
}

INCOME_BIN_MAP = {
    "0-3": 1, "3-6": 1, "6-10": 2, "10-15": 2, "15+": 3
}

def load_raw() -> pd.DataFrame:
    students = pd.read_csv(DATA_DIR / "students.csv")
    placement = pd.read_csv(DATA_DIR / "placement.csv")
    df = pd.merge(students, placement, on="Student_ID", how="inner")
    df["extracurricular_involvement"] = df["extracurricular_involvement"].fillna(
        df["extracurricular_involvement"].mode()[0]
    )
    return df

def preprocess(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    df["placement_status"] = df["placement_status"].map({"Placed": 1, "Not Placed": 0}).astype(int)

    for col, mapping in ORD_MAPS.items():
        df[col] = df[col].map(mapping).astype(int)

    df = pd.get_dummies(df, columns=["branch"], prefix="branch")

    for b in BRANCHES:
        col = f"branch_{b}"
        if col not in df.columns:
            df[col] = 0

    df["practical_experience"] = (
        df["projects_completed"] + df["internships_completed"] + df["hackathons_participated"]
    )
    df["skill_rating"] = (
        0.5 * df["coding_skill_rating"]
        + 0.2 * df["communication_skill_rating"]
        + 0.3 * df["aptitude_skill_rating"]
    )

    drop_cols = [
        "tenth_percentage", "study_hours_per_day", "attendance_percentage",
        "projects_completed", "internships_completed", "coding_skill_rating",
        "communication_skill_rating", "aptitude_skill_rating",
        "hackathons_participated", "sleep_hours", "stress_level",
        "Student_ID", "certifications_count",
    ]
    df = df.drop(columns=[c for c in drop_cols if c in df.columns])

    return df

def get_feature_columns(df: pd.DataFrame) -> list[str]:
    return [c for c in df.columns if c not in ("placement_status", "salary_lpa")]

def build_input_row(req) -> pd.DataFrame:
    branch_cols = {f"branch_{b}": 1 if b == req.branch else 0 for b in BRANCHES}

    row = {
        "twelfth_percentage": req.twelfth_pct,
        "cgpa": req.cgpa,
        "backlogs": req.backlogs,
        "gender": ORD_MAPS["gender"][req.gender],
        "city_tier": ORD_MAPS["city_tier"][req.city],
        "family_income_level": INCOME_BIN_MAP[req.income],
        "part_time_job": ORD_MAPS["part_time_job"][req.part_time],
        "internet_access": ORD_MAPS["internet_access"][req.internet],
        "extracurricular_involvement": ORD_MAPS["extracurricular_involvement"][req.extracurricular],
        "practical_experience": req.projects + req.internship + req.hackathon,
        "skill_rating": 0.5 * req.coding + 0.2 * req.comms + 0.3 * req.aptitude,
        **branch_cols,
    }

    return pd.DataFrame([row])