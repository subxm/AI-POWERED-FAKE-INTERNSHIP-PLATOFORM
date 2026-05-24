import pandas as pd
import numpy as np
import re
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

STOP_WORDS = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

# Red flag keywords commonly found in fake postings
RED_FLAG_KEYWORDS = [
    'earn from home', 'no experience needed', 'unlimited earnings',
    'work from home', 'be your own boss', 'financial freedom',
    'wire transfer', 'money order', 'western union', 'send money',
    'guaranteed income', 'no investment', 'passive income',
    'multi level', 'mlm', 'pyramid', 'commission only',
    'immediate hiring', 'urgently needed', 'apply now limited',
    'whatsapp', 'telegram', 'click here', 'limited slots'
]

def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'http\S+|www\S+', '', text)   # remove URLs
    text = re.sub(r'[^a-z\s]', '', text)          # remove special chars
    text = re.sub(r'\s+', ' ', text).strip()
    tokens = text.split()
    tokens = [lemmatizer.lemmatize(t) for t in tokens if t not in STOP_WORDS]
    return ' '.join(tokens)

def count_red_flags(text: str) -> int:
    if not isinstance(text, str):
        return 0
    text = text.lower()
    return sum(1 for kw in RED_FLAG_KEYWORDS if kw in text)

def build_features(df: pd.DataFrame) -> pd.DataFrame:
    features = pd.DataFrame()

    # --- Text combination for NLP ---
    df['combined_text'] = (
        df['title'].fillna('') + ' ' +
        df['company_profile'].fillna('') + ' ' +
        df['description'].fillna('') + ' ' +
        df['requirements'].fillna('') + ' ' +
        df['benefits'].fillna('')
    )
    features['clean_text'] = df['combined_text'].apply(clean_text)

    # --- Structural signals ---
    features['has_company_logo']    = df['has_company_logo'].fillna(0).astype(int)
    features['has_questions']       = df['has_questions'].fillna(0).astype(int)
    features['telecommuting']       = df['telecommuting'].fillna(0).astype(int)

    # --- Missing field signals (missingness = suspicious) ---
    features['missing_salary']          = df['salary_range'].isna().astype(int)
    features['missing_company_profile'] = df['company_profile'].isna().astype(int)
    features['missing_requirements']    = df['requirements'].isna().astype(int)
    features['missing_benefits']        = df['benefits'].isna().astype(int)
    features['missing_education']       = df['required_education'].isna().astype(int)
    features['missing_experience']      = df['required_experience'].isna().astype(int)
    features['missing_industry']        = df['industry'].isna().astype(int)
    features['missing_location']        = df['location'].isna().astype(int)

    # --- Text length signals ---
    features['desc_length']         = df['description'].fillna('').apply(len)
    features['req_length']          = df['requirements'].fillna('').apply(len)
    features['profile_length']      = df['company_profile'].fillna('').apply(len)

    # --- Red flag keyword count ---
    features['red_flag_count'] = df['combined_text'].apply(count_red_flags)

    # --- Employment type encoding ---
    emp_dummies = pd.get_dummies(df['employment_type'].fillna('Unknown'), prefix='emp')
    features = pd.concat([features, emp_dummies], axis=1)

    return features