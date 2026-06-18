# 📊 Emitrr Lead Intelligence & Revenue Analysis

AI-Powered Sales & Business Operations Assignment — Automated PPTX presentation generator for healthcare lead analysis.

## Overview

This project generates a **professional 8-slide PowerPoint presentation** analyzing 1,000 healthcare leads across sources, industries, and geographies. It includes descriptive analysis, funnel breakdowns, revenue potential, trend analysis, growth opportunities, and an ML-based lead scoring model.

## Slides

| # | Slide | Description |
|---|-------|-------------|
| 1 | **Title** | Executive title slide with key stats |
| 2 | **Descriptive Analysis** | KPI cards, leads by source, revenue by industry |
| 3 | **Funnel Analysis** | Lead → Demo → Customer conversion funnel |
| 4 | **Revenue Potential** | Revenue by industry & state breakdown |
| 5 | **Trend Analysis** | Monthly lead volume & revenue trends |
| 6 | **Growth Opportunities** | 6 AI-identified high-impact strategies |
| 7 | **ML Lead Scoring** | Gradient Boosting model details & feature importance |
| 8 | **Summary & Next Steps** | Key takeaways across all analyses |

## Tech Stack

- **Node.js** — Runtime
- **[pptxgenjs](https://www.npmjs.com/package/pptxgenjs)** — PowerPoint generation library

## Setup & Usage

### 1. Install dependencies (one-time)

```bash
pip3 install scikit-learn matplotlib joblib openpyxl pandas numpy
```

```bash
npm install
```

### 2. Train the model & score all leads

```bash
cd /Users/sonusingh/Emitrr-Assignment
python3 lead_scoring_model.py
```

### 3. Score new leads (after training)

```bash
python3 score_new_leads.py
```

Or use it programmatically in any Python script.

### 4. Generate the presentation

```bash
node generate_pptx.js
```

The generated file will be saved as `Sonu_Singh_Emitrr_Assignment.pptx` in the project root.

## Key Findings

- **1,000 total leads** across 7 sources and 6 healthcare industries
- **22.2% demo rate**, **6.7% customer conversion rate**
- **$2.63M** total monthly revenue potential
- **Webinar** leads convert at the highest rate (11.9%)
- **Employee count** is the #1 ML feature driving conversion (65.6% importance)
- ML model achieves **95.2% accuracy** using Gradient Boosting

## Author

**Sonu Singh** — AI Intern, Sales & Business Operations, Emitrr
