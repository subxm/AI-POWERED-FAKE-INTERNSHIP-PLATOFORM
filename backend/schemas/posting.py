from pydantic import BaseModel
from typing import Optional

class PostingInput(BaseModel):
    title: str
    company_profile:    Optional[str] = None
    description:        Optional[str] = None
    requirements:       Optional[str] = None
    benefits:           Optional[str] = None
    location:           Optional[str] = None
    salary_range:       Optional[str] = None
    employment_type:    Optional[str] = None
    required_experience: Optional[str] = None
    required_education:  Optional[str] = None
    industry:           Optional[str] = None
    has_company_logo:   Optional[int] = 0
    has_questions:      Optional[int] = 0
    telecommuting:      Optional[int] = 0

class RedFlag(BaseModel):
    flag: str
    severity: str    # "high", "medium", "low"

class AnalysisResult(BaseModel):
    trust_score:     int           # 0-100 (100 = fully trusted)
    risk_level:      str           # "low", "medium", "high"
    is_fake:         bool
    red_flags:       list[RedFlag]
    ml_score:        float         # raw ML model probability
    gemini_analysis: str           # Gemini's text explanation
    recommendation:  str