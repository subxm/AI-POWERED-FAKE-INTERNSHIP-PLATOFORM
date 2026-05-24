import pandas as pd
import numpy as np
import joblib
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from features.feature_builder import build_features
from sklearn.metrics import (
    classification_report, confusion_matrix,
    roc_auc_score, precision_recall_curve
)
from scipy.sparse import hstack, csr_matrix

MODEL_PATH      = "../backend/ml_models/scam_detector.pkl"
VECTORIZER_PATH = "../backend/ml_models/vectorizer.pkl"
RAW_DATA_PATH   = "dataset/raw/fake_job_postings.csv"

print("Loading model and vectorizer...")
model      = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

print("Loading dataset...")
df = pd.read_csv(RAW_DATA_PATH)
features   = build_features(df)
y          = df['fraudulent'].values

text_col        = features['clean_text']
structured_cols = features.drop(columns=['clean_text'])

X_tfidf   = vectorizer.transform(text_col)
X_combined = hstack([X_tfidf, csr_matrix(structured_cols.values.astype(float))])

print("\n--- Full Dataset Evaluation ---")
y_pred      = model.predict(X_combined)
y_pred_prob = model.predict_proba(X_combined)[:, 1]

print(classification_report(y, y_pred, target_names=['Legitimate', 'Fraudulent']))
print(f"ROC-AUC Score: {roc_auc_score(y, y_pred_prob):.4f}")
print("Confusion Matrix:")
print(confusion_matrix(y, y_pred))