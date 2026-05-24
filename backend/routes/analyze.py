from fastapi import APIRouter, HTTPException
from schemas.posting import PostingInput, AnalysisResult
from services.score_service import run_ml_analysis
from services.gemini_service import analyze_with_gemini

router = APIRouter()

@router.post("", response_model=AnalysisResult)
async def analyze_posting(posting: PostingInput):
    try:
        # 1. Run ML Analysis
        ml_results = await run_ml_analysis(posting)
        
        # 2. Run Gemini Analysis using the ML score
        gemini_results = await analyze_with_gemini(posting, ml_results["ml_score"])
        
        # 3. Combine results
        return AnalysisResult(
            trust_score=ml_results["trust_score"],
            risk_level=gemini_results["risk_level"],
            is_fake=gemini_results["is_fake"],
            red_flags=ml_results["red_flags"],
            ml_score=ml_results["ml_score"],
            gemini_analysis=gemini_results["gemini_analysis"],
            recommendation=gemini_results["recommendation"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")