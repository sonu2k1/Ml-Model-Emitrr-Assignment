"""
Lead Scoring ML Model for Emitrr
=================================
Builds a Gradient Boosting classifier to predict lead conversion probability,
then maps predicted probabilities to a 1–10 lead score.

Score interpretation:
  1  = Least likely to become a customer
  10 = Most likely to become a customer
"""

import os
import warnings
import json
import numpy as np
import pandas as pd
from datetime import datetime

from sklearn.model_selection import StratifiedKFold, cross_val_predict
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import (
    roc_auc_score, classification_report, confusion_matrix,
    precision_recall_curve, average_precision_score
)
from sklearn.calibration import CalibratedClassifierCV
import joblib

warnings.filterwarnings("ignore")

# ---------------------------------------------------------------------------
# 1. LOAD DATA
# ---------------------------------------------------------------------------
DATA_PATH = os.path.join(os.path.dirname(__file__),
                         "Assignment-AI Intern,Emitrr2.xlsx")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "model_output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

print("=" * 70)
print("EMITRR LEAD SCORING MODEL")
print("=" * 70)

df = pd.read_excel(DATA_PATH, sheet_name="DATASET - LEADS DATA")
print(f"\n📊 Dataset loaded: {df.shape[0]} leads, {df.shape[1]} columns")
print(f"   Columns: {list(df.columns)}")
print(f"   Customers: {df['Customer'].sum()} ({df['Customer'].mean()*100:.1f}%)")
print(f"   Demo Booked: {df['Demo_Booked'].sum()} ({df['Demo_Booked'].mean()*100:.1f}%)")

# ---------------------------------------------------------------------------
# 2. FEATURE ENGINEERING
# ---------------------------------------------------------------------------
print("\n" + "=" * 70)
print("FEATURE ENGINEERING")
print("=" * 70)

# Parse date and extract time-based features
df["Created_Date"] = pd.to_datetime(df["Created_Date"])
reference_date = df["Created_Date"].max()
df["Days_Since_Created"] = (reference_date - df["Created_Date"]).dt.days
df["Month"] = df["Created_Date"].dt.month
df["Quarter"] = df["Created_Date"].dt.quarter
df["DayOfWeek"] = df["Created_Date"].dt.dayofweek  # 0=Monday

# Employee size bucket (categorical feature for interactions)
df["Employee_Bucket"] = pd.cut(
    df["Employees"],
    bins=[0, 50, 150, 300, 500],
    labels=["Small", "Medium", "Large", "Enterprise"]
)

# Revenue per employee (efficiency signal)
df["Revenue_Per_Employee"] = df["Monthly_Revenue_Potential"] / df["Employees"].clip(lower=1)

# Log-transform skewed numerics
df["Log_Employees"] = np.log1p(df["Employees"])
df["Log_Revenue"] = np.log1p(df["Monthly_Revenue_Potential"])

# Encode categorical features
label_encoders = {}
categorical_cols = ["Source", "Industry", "State", "Employee_Bucket"]

for col in categorical_cols:
    le = LabelEncoder()
    df[f"{col}_Encoded"] = le.fit_transform(df[col].astype(str))
    label_encoders[col] = le
    print(f"   ✅ Encoded {col}: {len(le.classes_)} categories → {list(le.classes_)}")

# Aggregate features: conversion rate by category (leave-one-out to avoid leakage)
print("\n   📈 Computing target-encoded aggregates (leave-one-out)...")
for col in ["Source", "Industry", "State"]:
    global_mean = df["Customer"].mean()
    counts = df.groupby(col)["Customer"].transform("count")
    sums = df.groupby(col)["Customer"].transform("sum")
    # Leave-one-out: subtract current row from group stats
    smoothing = 10  # regularization factor
    df[f"{col}_ConvRate"] = (sums - df["Customer"] + smoothing * global_mean) / (counts - 1 + smoothing)
    print(f"   ✅ {col}_ConvRate computed")

# Interaction features
df["Demo_x_Revenue"] = df["Demo_Booked"] * df["Monthly_Revenue_Potential"]
df["Demo_x_Employees"] = df["Demo_Booked"] * df["Employees"]

# ---------------------------------------------------------------------------
# 3. DEFINE FEATURE SET
# ---------------------------------------------------------------------------
feature_cols = [
    # Numeric
    "Employees", "Monthly_Revenue_Potential", "Demo_Booked",
    "Days_Since_Created", "Month", "Quarter", "DayOfWeek",
    "Revenue_Per_Employee", "Log_Employees", "Log_Revenue",
    # Encoded categorical
    "Source_Encoded", "Industry_Encoded", "State_Encoded", "Employee_Bucket_Encoded",
    # Target-encoded aggregates
    "Source_ConvRate", "Industry_ConvRate", "State_ConvRate",
    # Interactions
    "Demo_x_Revenue", "Demo_x_Employees",
]

X = df[feature_cols].values
y = df["Customer"].values

print(f"\n   Feature matrix: {X.shape[0]} samples × {X.shape[1]} features")
print(f"   Features: {feature_cols}")

# ---------------------------------------------------------------------------
# 4. MODEL TRAINING & EVALUATION (Stratified K-Fold Cross-Validation)
# ---------------------------------------------------------------------------
print("\n" + "=" * 70)
print("MODEL TRAINING & EVALUATION")
print("=" * 70)

# Scale features for Logistic Regression
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Define models to compare
models = {
    "Logistic Regression": LogisticRegression(
        class_weight="balanced", max_iter=1000, C=0.5, random_state=42
    ),
    "Random Forest": RandomForestClassifier(
        n_estimators=200, max_depth=6, min_samples_leaf=5,
        class_weight="balanced", random_state=42
    ),
    "Gradient Boosting": GradientBoostingClassifier(
        n_estimators=200, max_depth=4, learning_rate=0.05,
        min_samples_leaf=5, subsample=0.8, random_state=42
    ),
}

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
best_model_name = None
best_auc = 0
best_probs = None

for name, model in models.items():
    print(f"\n--- {name} ---")
    X_input = X_scaled if name == "Logistic Regression" else X

    # Cross-validated probability predictions
    probs = cross_val_predict(model, X_input, y, cv=cv, method="predict_proba")[:, 1]
    auc = roc_auc_score(y, probs)
    ap = average_precision_score(y, probs)

    # Threshold-based metrics
    preds = (probs >= 0.5).astype(int)
    report = classification_report(y, preds, target_names=["Non-Customer", "Customer"])
    cm = confusion_matrix(y, preds)

    print(f"   ROC AUC:          {auc:.4f}")
    print(f"   Avg Precision:    {ap:.4f}")
    print(f"   Confusion Matrix: TN={cm[0,0]}, FP={cm[0,1]}, FN={cm[1,0]}, TP={cm[1,1]}")
    print(f"\n{report}")

    if auc > best_auc:
        best_auc = auc
        best_model_name = name
        best_probs = probs

print(f"\n🏆 Best Model: {best_model_name} (ROC AUC = {best_auc:.4f})")

# ---------------------------------------------------------------------------
# 5. TRAIN FINAL MODEL ON FULL DATA (with calibration)
# ---------------------------------------------------------------------------
print("\n" + "=" * 70)
print("TRAINING FINAL CALIBRATED MODEL")
print("=" * 70)

# Use GradientBoosting as base, wrap with Platt scaling for better calibration
base_model = GradientBoostingClassifier(
    n_estimators=200, max_depth=4, learning_rate=0.05,
    min_samples_leaf=5, subsample=0.8, random_state=42
)

# CalibratedClassifierCV does internal cross-val for calibration
calibrated_model = CalibratedClassifierCV(base_model, cv=5, method="sigmoid")
calibrated_model.fit(X, y)
print("   ✅ Calibrated Gradient Boosting trained on full dataset")

# ---------------------------------------------------------------------------
# 6. GENERATE LEAD SCORES (1–10)
# ---------------------------------------------------------------------------
print("\n" + "=" * 70)
print("GENERATING LEAD SCORES")
print("=" * 70)

# Get calibrated probabilities
final_probs = calibrated_model.predict_proba(X)[:, 1]
df["Conversion_Probability"] = final_probs

# --- Rank-based percentile scoring ---
# With a high-AUC model on imbalanced data, raw probabilities are bimodal.
# We use percentile rank to ensure a meaningful 1–10 spread.
# Leads are ranked by predicted conversion probability, then divided into
# 10 equal-size buckets based on their percentile rank.
ranks = final_probs.argsort().argsort()  # rank from 0 to N-1
percentiles = ranks / (len(ranks) - 1) * 100  # 0 to 100

# Map percentile to 1–10 score (each decile gets ~100 leads)
df["Lead_Score"] = np.ceil(percentiles / 10).astype(int)
df["Lead_Score"] = df["Lead_Score"].clip(1, 10)

# Store the percentile-to-score edges for inference on new leads
edges = np.percentile(final_probs, np.arange(0, 101, 10))
edges[0] -= 1e-6
edges[-1] += 1e-6

# Print score distribution
print("\n📊 Lead Score Distribution:")
print("-" * 45)
score_dist = df.groupby("Lead_Score").agg(
    Count=("Lead_ID", "count"),
    Actual_Customers=("Customer", "sum"),
    Avg_Probability=("Conversion_Probability", "mean"),
    Avg_Revenue=("Monthly_Revenue_Potential", "mean")
).reset_index()

for _, row in score_dist.iterrows():
    conv_rate = row["Actual_Customers"] / row["Count"] * 100 if row["Count"] > 0 else 0
    bar = "█" * int(row["Count"] / 10)
    print(f"   Score {int(row['Lead_Score']):2d} │ {int(row['Count']):4d} leads │ "
          f"Conv: {conv_rate:5.1f}% │ Prob: {row['Avg_Probability']:.3f} │ "
          f"Rev: ${row['Avg_Revenue']:,.0f} │ {bar}")

# ---------------------------------------------------------------------------
# 7. FEATURE IMPORTANCE
# ---------------------------------------------------------------------------
print("\n" + "=" * 70)
print("FEATURE IMPORTANCE (Gradient Boosting)")
print("=" * 70)

# Get feature importances from the base estimators
importances = np.zeros(len(feature_cols))
for cal_estimator in calibrated_model.calibrated_classifiers_:
    importances += cal_estimator.estimator.feature_importances_
importances /= len(calibrated_model.calibrated_classifiers_)

feat_importance = pd.DataFrame({
    "Feature": feature_cols,
    "Importance": importances
}).sort_values("Importance", ascending=False)

print("\n   Top Features:")
for i, (_, row) in enumerate(feat_importance.head(10).iterrows()):
    bar = "▓" * int(row["Importance"] * 100)
    print(f"   {i+1:2d}. {row['Feature']:<30s} {row['Importance']:.4f}  {bar}")

# ---------------------------------------------------------------------------
# 8. SAVE OUTPUTS
# ---------------------------------------------------------------------------
print("\n" + "=" * 70)
print("SAVING OUTPUTS")
print("=" * 70)

# Save scored leads to Excel
output_cols = [
    "Lead_ID", "Source", "Industry", "Employees", "State",
    "Created_Date", "Demo_Booked", "Customer",
    "Monthly_Revenue_Potential", "Conversion_Probability", "Lead_Score"
]
scored_df = df[output_cols].sort_values("Lead_Score", ascending=False)
scored_path = os.path.join(OUTPUT_DIR, "scored_leads.xlsx")
scored_df.to_excel(scored_path, index=False, sheet_name="Scored Leads")
print(f"   ✅ Scored leads → {scored_path}")

# Save model
model_path = os.path.join(OUTPUT_DIR, "lead_scoring_model.pkl")
joblib.dump(calibrated_model, model_path)
print(f"   ✅ Model → {model_path}")

# Save scaler and encoders
artifacts_path = os.path.join(OUTPUT_DIR, "preprocessing_artifacts.pkl")
joblib.dump({
    "scaler": scaler,
    "label_encoders": label_encoders,
    "feature_cols": feature_cols,
    "quantile_edges": edges.tolist(),
}, artifacts_path)
print(f"   ✅ Preprocessing artifacts → {artifacts_path}")

# Save feature importances
feat_importance.to_csv(os.path.join(OUTPUT_DIR, "feature_importance.csv"), index=False)
print(f"   ✅ Feature importance → {os.path.join(OUTPUT_DIR, 'feature_importance.csv')}")

# Save model evaluation summary
eval_summary = {
    "best_model": best_model_name,
    "roc_auc_cv": round(best_auc, 4),
    "n_samples": int(X.shape[0]),
    "n_features": int(X.shape[1]),
    "n_customers": int(y.sum()),
    "customer_rate": round(float(y.mean()), 4),
    "score_distribution": {
        int(row["Lead_Score"]): {
            "count": int(row["Count"]),
            "actual_customers": int(row["Actual_Customers"]),
            "avg_probability": round(float(row["Avg_Probability"]), 4),
        }
        for _, row in score_dist.iterrows()
    },
    "top_features": feat_importance.head(10).to_dict(orient="records"),
}
with open(os.path.join(OUTPUT_DIR, "model_evaluation.json"), "w") as f:
    json.dump(eval_summary, f, indent=2, default=str)
print(f"   ✅ Evaluation summary → {os.path.join(OUTPUT_DIR, 'model_evaluation.json')}")

# ---------------------------------------------------------------------------
# 9. SHOW SAMPLE HIGH-SCORE & LOW-SCORE LEADS
# ---------------------------------------------------------------------------
print("\n" + "=" * 70)
print("SAMPLE SCORED LEADS")
print("=" * 70)

print("\n🔥 Top 10 Leads (Most Likely to Convert):")
print("-" * 90)
top = scored_df.head(10)
for _, r in top.iterrows():
    print(f"   {r['Lead_ID']} │ Score: {int(r['Lead_Score']):2d} │ Prob: {r['Conversion_Probability']:.3f} │ "
          f"{r['Source']:<15s} │ {r['Industry']:<20s} │ Demo: {int(r['Demo_Booked'])} │ "
          f"Customer: {int(r['Customer'])} │ Rev: ${r['Monthly_Revenue_Potential']:,.0f}")

print("\n❄️  Bottom 10 Leads (Least Likely to Convert):")
print("-" * 90)
bottom = scored_df.tail(10)
for _, r in bottom.iterrows():
    print(f"   {r['Lead_ID']} │ Score: {int(r['Lead_Score']):2d} │ Prob: {r['Conversion_Probability']:.3f} │ "
          f"{r['Source']:<15s} │ {r['Industry']:<20s} │ Demo: {int(r['Demo_Booked'])} │ "
          f"Customer: {int(r['Customer'])} │ Rev: ${r['Monthly_Revenue_Potential']:,.0f}")

print("\n" + "=" * 70)
print("✅ LEAD SCORING COMPLETE")
print(f"   Model: Calibrated {best_model_name}")
print(f"   ROC AUC: {best_auc:.4f}")
print(f"   Leads scored: {len(df)}")
print(f"   Output directory: {OUTPUT_DIR}")
print("=" * 70)
