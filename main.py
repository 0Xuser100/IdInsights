import os
import uuid
import shutil
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from dotenv import load_dotenv

from models.id_card import UploadResponse, ProcessResponse, IdCardData
from services.document_ai import document_ai_service
from services.openai_fixer import fix_ocr_text, extract_id_fields
from services.convex_db import get_convex_service

load_dotenv()

app = FastAPI(
    title="Egyptian National ID Scanner",
    description="API for scanning and extracting data from Egyptian National ID cards",
    version="1.0.0"
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

app.mount("/static", StaticFiles(directory="public"), name="static")


@app.get("/", response_class=HTMLResponse)
async def root():
    """Serve the test UI."""
    with open("public/index.html", "r", encoding="utf-8") as f:
        return f.read()


@app.post("/upload", response_model=UploadResponse)
async def upload_images(
    face: UploadFile = File(..., description="صورة الوجه - Front side with photo"),
    back: UploadFile = File(..., description="الخلفية - Back side with address")
):
    """Upload face and back images of an Egyptian National ID card."""
    upload_id = str(uuid.uuid4())
    upload_folder = UPLOAD_DIR / upload_id
    upload_folder.mkdir(exist_ok=True)

    face_ext = Path(face.filename).suffix or ".jpg"
    back_ext = Path(back.filename).suffix or ".jpg"

    face_path = upload_folder / f"face{face_ext}"
    back_path = upload_folder / f"back{back_ext}"

    with open(face_path, "wb") as f:
        shutil.copyfileobj(face.file, f)

    with open(back_path, "wb") as f:
        shutil.copyfileobj(back.file, f)

    return UploadResponse(
        upload_id=upload_id,
        face_path=str(face_path),
        back_path=str(back_path)
    )


@app.post("/process/{upload_id}", response_model=ProcessResponse)
async def process_id_card(upload_id: str):
    """Process uploaded ID card images with Document AI and OpenAI."""
    upload_folder = UPLOAD_DIR / upload_id

    if not upload_folder.exists():
        raise HTTPException(status_code=404, detail="Upload not found")

    face_files = list(upload_folder.glob("face.*"))
    back_files = list(upload_folder.glob("back.*"))

    if not face_files or not back_files:
        raise HTTPException(status_code=400, detail="Missing face or back image")

    face_path = str(face_files[0])
    back_path = str(back_files[0])

    try:
        ocr_result = document_ai_service.process_id_card(face_path, back_path)
        raw_ocr_text = ocr_result["combined_text"]

        corrected_text = fix_ocr_text(raw_ocr_text)

        fields = extract_id_fields(corrected_text)

        id_card_data = IdCardData(
            name=fields.get("name"),
            national_id=fields.get("national_id"),
            address=fields.get("address"),
            date_of_birth=fields.get("date_of_birth"),
            gender=fields.get("gender"),
            religion=fields.get("religion"),
            marital_status=fields.get("marital_status"),
            expiry_date=fields.get("expiry_date"),
            job=fields.get("job"),
        )

        try:
            convex_service = get_convex_service()
            convex_service.save_id_card(
                face_image_path=face_path,
                back_image_path=back_path,
                name=id_card_data.name,
                national_id=id_card_data.national_id,
                address=id_card_data.address,
                date_of_birth=id_card_data.date_of_birth,
                gender=id_card_data.gender,
                religion=id_card_data.religion,
                marital_status=id_card_data.marital_status,
                expiry_date=id_card_data.expiry_date,
                raw_ocr_text=raw_ocr_text,
                corrected_text=corrected_text,
            )
        except Exception as e:
            print(f"Warning: Could not save to Convex: {e}")

        return ProcessResponse(
            success=True,
            data=id_card_data,
            raw_ocr_text=raw_ocr_text,
            corrected_text=corrected_text
        )

    except Exception as e:
        return ProcessResponse(
            success=False,
            error=str(e)
        )


@app.get("/results")
async def get_all_results():
    """Get all stored ID card records."""
    try:
        convex_service = get_convex_service()
        results = convex_service.get_all_id_cards()
        return {"success": True, "data": results}
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.get("/results/{card_id}")
async def get_result_by_id(card_id: str):
    """Get a specific ID card record by ID."""
    try:
        convex_service = get_convex_service()
        result = convex_service.get_id_card_by_id(card_id)
        if not result:
            raise HTTPException(status_code=404, detail="Record not found")
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
