"""
Score New Leads
===============
Utility to score new leads using the trained lead scoring model.

Usage:
    python3 score_new_leads.py

Or import and use programmatically:
    from score_new_leads import score_lead
    result = score_lead(
        source="Referral",
        industry="Dental",
        employees=150,
        state="CA",
        created_date="2026-06-17",
        demo_booked=1,
        monthly_revenue_potential=3500
    )
    print(result)  # {'lead_score': 8, 'conversion_probability': 0.72, ...}
"""

import os
import numpy as np
import pandas as pd
from datetime import datetime
import joblib

# Load model and preprocessing artifacts
MODEL_DIR = os.path.join(os.path.dirname(__file__), "model_output")

_model = None
_artifacts = None


def _load_model():
    """Lazy-load model and artifacts."""
    global _model, _artifacts
    if _model is None:
        _model = joblib.load(os.path.join(MODEL_DIR, "lead_scoring_model.pkl"))
        _artifacts = joblib.load(os.path.join(MODEL_DIR, "preprocessing_artifacts.pkl"))
    return _model, _artifacts


def score_lead(
    source: str,
    industry: str,
    employees: int,
    state: str,
    created_date: str,
    demo_booked: int,
    monthly_revenue_potential: float,
) -> dict:
    """
    Score a single lead.

    Parameters
    ----------
    source : str
        Lead source (e.g., 'Referral', 'Paid Search', 'LinkedIn', etc.)
    industry : str
        Industry (e.g., 'Dental', 'Primary Care', 'Behavioral Health', etc.)
    employees : int
        Number of employees
    state : str
        Two-letter state code (e.g., 'CA', 'TX', 'NY')
    created_date : str
        Date the lead was created (YYYY-MM-DD)
    demo_booked : int
        Whether a demo was booked (0 or 1)
    monthly_revenue_potential : float
        Estimated monthly revenue potential

    Returns
    -------
    dict with keys:
        - lead_score (int, 1-10)
        - conversion_probability (float, 0-1)
        - score_label (str)
    """
    model, artifacts = _load_model()
    le_dict = artifacts["label_encoders"]
    feature_cols = artifacts["feature_cols"]
    edges = np.array(artifacts["quantile_edges"])

    # Parse date
    dt = pd.to_datetime(created_date)
    reference_date = pd.to_datetime("2026-06-17")  # Aligned with training data
    days_since = (reference_date - dt).days

    # Employee bucket
    if employees <= 50:
        emp_bucket = "Small"
    elif employees <= 150:
        emp_bucket = "Medium"
    elif employees <= 300:
        emp_bucket = "Large"
    else:
        emp_bucket = "Enterprise"

    # Encode categoricals (handle unseen labels gracefully)
    def safe_encode(le, value):
        if value in le.classes_:
            return le.transform([value])[0]
        return 0  # fallback to first class

    source_enc = safe_encode(le_dict["Source"], source)
    industry_enc = safe_encode(le_dict["Industry"], industry)
    state_enc = safe_encode(le_dict["State"], state)
    emp_bucket_enc = safe_encode(le_dict["Employee_Bucket"], emp_bucket)

    # Build feature vector (must match training order)
    features = {
        "Employees": employees,
        "Monthly_Revenue_Potential": monthly_revenue_potential,
        "Demo_Booked": demo_booked,
        "Days_Since_Created": days_since,
        "Month": dt.month,
        "Quarter": dt.quarter,
        "DayOfWeek": dt.dayofweek,
        "Revenue_Per_Employee": monthly_revenue_potential / max(employees, 1),
        "Log_Employees": np.log1p(employees),
        "Log_Revenue": np.log1p(monthly_revenue_potential),
        "Source_Encoded": source_enc,
        "Industry_Encoded": industry_enc,
        "State_Encoded": state_enc,
        "Employee_Bucket_Encoded": emp_bucket_enc,
        # Target-encoded aggregates — use global mean as fallback (0.067)
        "Source_ConvRate": 0.067,
        "Industry_ConvRate": 0.067,
        "State_ConvRate": 0.067,
        "Demo_x_Revenue": demo_booked * monthly_revenue_potential,
        "Demo_x_Employees": demo_booked * employees,
    }

    X = np.array([[features[col] for col in feature_cols]])
    prob = model.predict_proba(X)[0, 1]

    # Map to 1-10 score
    score = int(np.digitize(prob, edges[1:])) + 1
    score = max(1, min(10, score))

    # Score label
    labels = {
        1: "Very Cold", 2: "Cold", 3: "Cool", 4: "Lukewarm", 5: "Warm",
        6: "Interested", 7: "Engaged", 8: "Hot", 9: "Very Hot", 10: "On Fire"
    }

    return {
        "lead_score": score,
        "conversion_probability": round(float(prob), 4),
        "score_label": labels.get(score, "Unknown"),
    }


# ---------------------------------------------------------------------------
# Demo: Score example leads interactively
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    print("=" * 60)
    print("LEAD SCORING — SCORE NEW LEADS")
    print("=" * 60)

    # Example leads
    examples = [
        {
            "source": "Referral",
            "industry": "Dental",
            "employees": 150,
            "state": "CA",
            "created_date": "2026-06-15",
            "demo_booked": 1,
            "monthly_revenue_potential": 3500,
        },
        {
            "source": "Organic Search",
            "industry": "Behavioral Health",
            "employees": 30,
            "state": "NY",
            "created_date": "2026-01-10",
            "demo_booked": 0,
            "monthly_revenue_potential": 1200,
        },
        {
            "source": "Paid Search",
            "industry": "Primary Care",
            "employees": 400,
            "state": "TX",
            "created_date": "2026-06-01",
            "demo_booked": 1,
            "monthly_revenue_potential": 4800,
        },
    ]

    for i, lead in enumerate(examples, 1):
        result = score_lead(**lead)
        print(f"\n📋 Lead {i}: {lead['industry']} / {lead['source']} / "
              f"{lead['employees']} emp / Demo={lead['demo_booked']}")
        print(f"   🎯 Score: {result['lead_score']}/10 ({result['score_label']})")
        print(f"   📊 Conversion Probability: {result['conversion_probability']:.1%}")
