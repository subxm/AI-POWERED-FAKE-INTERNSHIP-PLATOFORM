import joblib
import os
import pandas as pd
import numpy as np
from scipy.sparse import hstack, csr_matrix
from sklearn.feature_extraction.text import TfidfVectorizer
from schemas.posting import PostingInput, AnalysisResult, RedFlag
from services.nlp_service import get_cleaned_text, get_red_flags, get_missing_fields_count

# --- Load ML model and vectorizer on startup ---
BASE_DIR       = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH     = os.path.join(BASE_DIR, '../ml_models/scam_detector.pkl')
VECTORIZER_PATH = os.path.join(BASE_DIR, '../ml_models/vectorizer.pkl')

model      = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

def build_structured_features(posting: PostingInput) -> np.ndarray:
    features = {
        'has_company_logo':         int(posting.has_company_logo or 0),
        'has_questions':            int(posting.has_questions or 0),
        'telecommuting':            int(posting.telecommuting or 0),
        'missing_salary':           int(not posting.salary_range),
        'missing_company_profile':  int(not posting.company_profile),
        'missing_requirements':     int(not posting.requirements),
        'missing_benefits':         int(not posting.benefits),
        'missing_education':        int(not posting.required_education),
        'missing_experience':       int(not posting.required_experience),
        'missing_industry':         int(not posting.industry),
        'missing_location':         int(not posting.location),
        'desc_length':              len(posting.description or ''),
        'req_length':               len(posting.requirements or ''),
        'profile_length':           len(posting.company_profile or ''),
        'red_flag_count':           len(get_red_flags(posting)),
        # Employment type dummies (match training columns)
        'emp_Contract':             int((posting.employment_type or '') == 'Contract'),
        'emp_Full-time':            int((posting.employment_type or '') == 'Full-time'),
        'emp_Other':                int((posting.employment_type or '') == 'Other'),
        'emp_Part-time':            int((posting.employment_type or '') == 'Part-time'),
        'emp_Temporary':            int((posting.employment_type or '') == 'Temporary'),
        'emp_Unknown':              int(not posting.employment_type),
    }
    return np.array(list(features.values()), dtype=float).reshape(1, -1)

def calculate_trust_score(ml_prob: float, red_flag_count: int, missing_count: int) -> int:
    # Start from ML probability (inverted — high prob of fraud = low trust)
    base_score = (1 - ml_prob) * 100

    # Penalize for red flags
    base_score -= red_flag_count * 3

    # Penalize for missing fields
    base_score -= missing_count * 2

    return max(0, min(100, int(base_score)))

async def run_ml_analysis(posting: PostingInput) -> dict:
    # Text features
    cleaned = get_cleaned_text(posting)
    text_vector = vectorizer.transform([cleaned])

    # Structured features
    struct_vector = csr_matrix(build_structured_features(posting))

    # Combine
    combined = hstack([text_vector, struct_vector])

    # Predict
    ml_prob = float(model.predict_proba(combined)[0][1])

    # Red flags and missing fields
    red_flags     = get_red_flags(posting)
    missing_count = get_missing_fields_count(posting)
    trust_score   = calculate_trust_score(ml_prob, len(red_flags), missing_count)

    return {
        "ml_score":    ml_prob,
        "red_flags":   red_flags,
        "trust_score": trust_score,
        "missing_count": missing_count
    }