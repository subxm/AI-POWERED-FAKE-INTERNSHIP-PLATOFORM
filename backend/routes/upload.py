from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from schemas.posting import PostingInput
import pdfplumber
import docx
import io

router = APIRouter()

def extract_from_pdf(content: bytes) -> str:
    text = ""
    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ''
    return text

def extract_from_docx(content: bytes) -> str:
    doc  = docx.Document(io.BytesIO(content))
    return '\n'.join([para.text for para in doc.paragraphs])

@router.post("/")
async def upload_posting(file: UploadFile = File(...)):
    allowed = ["application/pdf",
               "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
               "text/plain"]

    if file.content_type not in allowed:
        raise HTTPException(status_code=400, detail="Only PDF, DOCX, or TXT files allowed")

    content = await file.read()

    try:
        if file.content_type == "application/pdf":
            text = extract_from_pdf(content)
        elif "wordprocessingml" in file.content_type:
            text = extract_from_docx(content)
        else:
            text = content.decode("utf-8")

        # Return as a PostingInput with description filled
        return PostingInput(
            title       = file.filename or "Uploaded Posting",
            description = text
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File parsing failed: {str(e)}")