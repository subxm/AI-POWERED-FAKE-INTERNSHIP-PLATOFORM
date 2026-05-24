from google import genai
import json
import re
from config import get_settings
from schemas.posting import PostingInput

settings = get_settings()
client = genai.Client(api_key=settings.GEMINI_API_KEY)

def build_prompt(posting: PostingInput, ml_score: float) -> str:
    return f"""
You are an expert fraud detection analyst specializing in fake internship and job postings.

Analyze the following internship/job posting and determine if it is fraudulent.
The ML model has given it a fraud probability of {ml_score:.2f} (0=legitimate, 1=fake).

--- POSTING DETAILS ---
Title: {posting.title}
Location: {posting.location or 'Not provided'}
Industry: {posting.industry or 'Not provided'}
Employment Type: {posting.employment_type or 'Not provided'}
Required Experience: {posting.required_experience or 'Not provided'}
Required Education: {posting.required_education or 'Not provided'}
Salary Range: {posting.salary_range or 'Not provided'}
Has Company Logo: {'Yes' if posting.has_company_logo else 'No'}
Has Screening Questions: {'Yes' if posting.has_questions else 'No'}

Company Profile:
{posting.company_profile or 'Not provided'}

Description:
{posting.description or 'Not provided'}

Requirements:
{posting.requirements or 'Not provided'}

Benefits:
{posting.benefits or 'Not provided'}
-----------------------

Respond ONLY with a valid JSON object in this exact format, no extra text:
{{
    "risk_level": "low" | "medium" | "high",
    "is_fake": true | false,
    "gemini_analysis": "2-3 sentence explanation of your verdict",
    "recommendation": "one sentence advice for the job seeker"
}}
"""

async def analyze_with_gemini(posting: PostingInput, ml_score: float) -> dict:
    try:
        prompt = build_prompt(posting, ml_score)
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        raw = response.text.strip()

        # Strip markdown code fences if Gemini wraps in ```json
        raw = re.sub(r'^```json|^```|```$', '', raw, flags=re.MULTILINE).strip()

        result = json.loads(raw)
        return result

    except json.JSONDecodeError:
        # Fallback if Gemini returns non-JSON
        return {
            "risk_level": "medium",
            "is_fake": ml_score > 0.5,
            "gemini_analysis": "Analysis could not be parsed. Please try again.",
            "recommendation": "Proceed with caution and verify the company independently."
        }
    except Exception as e:
        return {
            "risk_level": "medium",
            "is_fake": ml_score > 0.5,
            "gemini_analysis": f"Gemini analysis failed: {str(e)}",
            "recommendation": "Proceed with caution and verify the company independently."
        }