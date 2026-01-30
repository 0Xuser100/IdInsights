import os
import time
from convex import ConvexClient
from dotenv import load_dotenv

load_dotenv()


class ConvexDBService:
    def __init__(self):
        convex_url = os.getenv("CONVEX_URL")
        if not convex_url:
            raise ValueError("CONVEX_URL environment variable is required")
        self.client = ConvexClient(convex_url)

    def save_id_card(
        self,
        face_image_path: str,
        back_image_path: str,
        name: str = None,
        national_id: str = None,
        address: str = None,
        date_of_birth: str = None,
        gender: str = None,
        religion: str = None,
        marital_status: str = None,
        expiry_date: str = None,
        raw_ocr_text: str = None,
        corrected_text: str = None,
    ) -> str:
        """Save ID card data to Convex database."""
        result = self.client.mutation(
            "documents:createIdCard",
            {
                "faceImagePath": face_image_path,
                "backImagePath": back_image_path,
                "name": name,
                "nationalId": national_id,
                "address": address,
                "dateOfBirth": date_of_birth,
                "gender": gender,
                "religion": religion,
                "maritalStatus": marital_status,
                "expiryDate": expiry_date,
                "rawOcrText": raw_ocr_text,
                "correctedText": corrected_text,
                "createdAt": int(time.time() * 1000),
            },
        )
        return result

    def get_all_id_cards(self) -> list:
        """Get all ID card records from database."""
        return self.client.query("documents:getAllIdCards")

    def get_id_card_by_id(self, card_id: str) -> dict:
        """Get a specific ID card record by ID."""
        return self.client.query("documents:getIdCardById", {"id": card_id})


convex_db_service = None


def get_convex_service():
    global convex_db_service
    if convex_db_service is None:
        convex_db_service = ConvexDBService()
    return convex_db_service
