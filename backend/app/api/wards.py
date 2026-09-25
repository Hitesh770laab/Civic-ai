from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import WardModel, WardResponse

router = APIRouter(prefix="/wards", tags=["Wards"])

@router.get("", response_model=List[WardResponse])
def list_wards(db: Session = Depends(get_db)):
    wards = db.query(WardModel).all()
    return wards
