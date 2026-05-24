from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReportCreate(BaseModel):
    posting_title:  str
    company_name:   Optional[str] = None
    trust_score:    int
    risk_level:     str
    is_fake:        bool
    gemini_analysis: str
    red_flags:      list[dict]

class ReportResponse(BaseModel):
    id:             str
    user_id:        str
    posting_title:  str
    company_name:   Optional[str] = None
    trust_score:    int
    risk_level:     str
    is_fake:        bool
    created_at:     datetime