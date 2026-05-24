import re
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../ml')))

from features.feature_builder import clean_text, count_red_flags, RED_FLAG_KEYWORDS
from schemas.posting import PostingInput, RedFlag

def extract_text_from_posting(posting: PostingInput) -> str:
    parts = [
        posting.title               or '',
        posting.company_profile     or '',
        posting.description         or '',
        posting.requirements        or '',
        posting.benefits            or ''
    ]
    return ' '.join(parts)

def get_cleaned_text(posting: PostingInput) -> str:
    raw = extract_text_from_posting(posting)
    return clean_text(raw)

def get_red_flags(posting: PostingInput) -> list[RedFlag]:
    raw_text = extract_text_from_posting(posting).lower()
    flags = []

    for keyword in RED_FLAG_KEYWORDS:
        if keyword in raw_text:
            # Classify severity based on keyword type
            if any(k in keyword for k in ['wire transfer', 'western union', 'send money', 'money order']):
                severity = 'high'
            elif any(k in keyword for k in ['whatsapp', 'telegram', 'pyramid', 'mlm']):
                severity = 'high'
            elif any(k in keyword for k in ['guaranteed', 'unlimited', 'passive income', 'commission only']):
                severity = 'medium'
            else:
                severity = 'low'

            flags.append(RedFlag(flag=keyword, severity=severity))

    # Structural red flags
    if not posting.has_company_logo:
        flags.append(RedFlag(flag="No company logo provided", severity="medium"))

    if not posting.company_profile:
        flags.append(RedFlag(flag="No company profile provided", severity="medium"))

    if not posting.requirements:
        flags.append(RedFlag(flag="No requirements listed", severity="low"))

    if not posting.salary_range:
        flags.append(RedFlag(flag="No salary range mentioned", severity="low"))

    if not posting.has_questions:
        flags.append(RedFlag(flag="No screening questions", severity="low"))

    return flags

def get_missing_fields_count(posting: PostingInput) -> int:
    fields = [
        posting.company_profile,
        posting.description,
        posting.requirements,
        posting.benefits,
        posting.salary_range,
        posting.industry,
        posting.location,
        posting.required_education,
        posting.required_experience
    ]
    return sum(1 for f in fields if not f)