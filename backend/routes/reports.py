from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from bson import ObjectId
from typing import List

from schemas.report import ReportCreate, ReportResponse
from routes.auth import get_current_user
from database.mongodb import get_db

router = APIRouter()

@router.post("/", response_model=ReportResponse)
async def save_report(
    report: ReportCreate,
    current_user: dict = Depends(get_current_user)
):
    db  = get_db()
    doc = {
        "user_id":        str(current_user["_id"]),
        "posting_title":  report.posting_title,
        "company_name":   report.company_name,
        "trust_score":    report.trust_score,
        "risk_level":     report.risk_level,
        "is_fake":        report.is_fake,
        "gemini_analysis": report.gemini_analysis,
        "red_flags":      report.red_flags,
        "created_at":     datetime.utcnow()
    }
    result = await db["reports"].insert_one(doc)
    doc["id"]      = str(result.inserted_id)
    doc["user_id"] = str(current_user["_id"])
    return ReportResponse(**doc)

@router.get("/", response_model=List[ReportResponse])
async def get_my_reports(current_user: dict = Depends(get_current_user)):
    db      = get_db()
    cursor  = db["reports"].find({"user_id": str(current_user["_id"])}).sort("created_at", -1)
    reports = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        reports.append(ReportResponse(**doc))
    return reports

@router.delete("/{report_id}")
async def delete_report(
    report_id: str,
    current_user: dict = Depends(get_current_user)
):
    db     = get_db()
    result = await db["reports"].delete_one({
        "_id":     ObjectId(report_id),
        "user_id": str(current_user["_id"])
    })
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"message": "Report deleted successfully"}