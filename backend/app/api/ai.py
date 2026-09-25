from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from pydantic import BaseModel
from app.services.ai_classifier import analyze_issue
from app.services.yolo_service import yolo_service

router = APIRouter(prefix="/ai", tags=["AI Engine"])

class ClassifyRequest(BaseModel):
    issue_type: str
    description: Optional[str] = ""

@router.post("/classify")
def classify_text_endpoint(req: ClassifyRequest):
    """
    Live interactive simulation of the explainable AI classifier.
    Returns the full explainability breakdown before report submission.
    """
    if not req.issue_type:
        raise HTTPException(status_code=400, detail="issue_type is required")
    
    result = analyze_issue(req.issue_type, req.description or "")
    return result

@router.post("/yolo-detect")
async def yolo_detect_endpoint(
    file: UploadFile = File(...),
    issue_type: Optional[str] = Form(None)
):
    """
    Runs YOLO computer vision inference on uploaded image.
    Returns bounding box coordinates, detected defect tags, confidence scores,
    and an annotated visualization overlay.
    """
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty image file received")
        
    detection_result = yolo_service.detect_defects(contents, issue_type)
    return detection_result
