import pandas as pd
import numpy as np
import joblib
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from features.feature_builder import build_features
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.metrics import classification_report, confusion_matrix
from imblearn.over_sampling import SMOTE
from scipy.sparse import hstack, csr_matrix

# --- Paths ---
RAW_DATA_PATH      = "dataset/raw/fake_job_postings.csv"
PROCESSED_DIR      = "dataset/processed/"
MODEL_OUTPUT_DIR   = "../backend/ml_models/"

os.makedirs(PROCESSED_DIR, exist_ok=True)
os.makedirs(MODEL_OUTPUT_DIR, exist_ok=True)

print("Loading dataset...")
df = pd.read_csv(RAW_DATA_PATH)
print(f"Dataset shape: {df.shape}")
print(f"Fraud rate: {df['fraudulent'].mean()*100:.2f}%")

# --- Build features ---
print("\nBuilding features...")
features = build_features(df)
y = df['fraudulent'].values

# --- Split text vs structured ---
text_col        = features['clean_text']
structured_cols = features.drop(columns=['clean_text'])

# --- Train/test split (stratified to preserve fraud ratio) ---
(X_text_train, X_text_test,
 X_struct_train, X_struct_test,
 y_train, y_test) = train_test_split(
    text_col, structured_cols, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Save processed splits
X_text_train.to_csv(f"{PROCESSED_DIR}train_text.csv", index=False)
X_text_test.to_csv(f"{PROCESSED_DIR}test_text.csv", index=False)
X_struct_train.to_csv(f"{PROCESSED_DIR}train_structured.csv", index=False)
X_struct_test.to_csv(f"{PROCESSED_DIR}test_structured.csv", index=False)
print(f"Processed data saved to {PROCESSED_DIR}")

# --- TF-IDF on text ---
print("\nFitting TF-IDF vectorizer...")
vectorizer = TfidfVectorizer(
    max_features=5000,
    ngram_range=(1, 2),   # unigrams + bigrams
    min_df=2
)
X_text_train_tfidf = vectorizer.fit_transform(X_text_train)
X_text_test_tfidf  = vectorizer.transform(X_text_test)

# --- Combine text + structured features ---
X_train_combined = hstack([X_text_train_tfidf, csr_matrix(X_struct_train.values.astype(float))])
X_test_combined  = hstack([X_text_test_tfidf,  csr_matrix(X_struct_test.values.astype(float))])

# --- Handle class imbalance with SMOTE ---
print("Applying SMOTE to handle class imbalance...")
smote = SMOTE(random_state=42)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train_combined, y_train)
print(f"After SMOTE — class distribution: {np.bincount(y_train_resampled)}")

# --- Train model ---
print("\nTraining Gradient Boosting classifier...")
model = GradientBoostingClassifier(
    n_estimators=200,
    learning_rate=0.1,
    max_depth=5,
    random_state=42
)
model.fit(X_train_resampled, y_train_resampled)

# --- Evaluate ---
print("\n--- Evaluation on Test Set ---")
y_pred = model.predict(X_test_combined)
print(classification_report(y_test, y_pred, target_names=['Legitimate', 'Fraudulent']))
print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# --- Save model and vectorizer ---
joblib.dump(model,      f"{MODEL_OUTPUT_DIR}scam_detector.pkl")
joblib.dump(vectorizer, f"{MODEL_OUTPUT_DIR}vectorizer.pkl")
print(f"\nModel saved to {MODEL_OUTPUT_DIR}scam_detector.pkl")
print(f"Vectorizer saved to {MODEL_OUTPUT_DIR}vectorizer.pkl")