from pydantic import BaseModel
from typing import Optional


class IdCardData(BaseModel):
    name: Optional[str] = None
    national_id: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    religion: Optional[str] = None
    marital_status: Optional[str] = None
    expiry_date: Optional[str] = None
    job: Optional[str] = None


class UploadResponse(BaseModel):
    upload_id: str
    face_path: str
    back_path: str


class ProcessResponse(BaseModel):
    success: bool
    data: Optional[IdCardData] = None
    raw_ocr_text: Optional[str] = None
    corrected_text: Optional[str] = None
    error: Optional[str] = None


class IdCardRecord(BaseModel):
    id: str
    face_image_path: str
    back_image_path: str
    name: Optional[str] = None
    national_id: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    religion: Optional[str] = None
    marital_status: Optional[str] = None
    expiry_date: Optional[str] = None
    raw_ocr_text: Optional[str] = None
    corrected_text: Optional[str] = None
    created_at: int
