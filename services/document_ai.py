import os
from typing import Optional
from google.api_core.client_options import ClientOptions
from google.cloud import documentai
from dotenv import load_dotenv

load_dotenv()


class DocumentAIService:
    def __init__(self):
        self.project_id = os.getenv("GCP_PROJECT_ID", "215297851036")
        self.location = os.getenv("GCP_LOCATION", "us")
        self.processor_id = os.getenv("GCP_PROCESSOR_ID", "178745fbdde45a70")

        opts = ClientOptions(api_endpoint=f"{self.location}-documentai.googleapis.com")
        self.client = documentai.DocumentProcessorServiceClient(client_options=opts)
        self.processor_name = self.client.processor_path(
            self.project_id, self.location, self.processor_id
        )

    def process_image(self, file_path: str, mime_type: str = "image/jpeg") -> str:
        """Process an image with Document AI and return extracted text."""
        with open(file_path, "rb") as image_file:
            image_content = image_file.read()

        raw_document = documentai.RawDocument(
            content=image_content,
            mime_type=mime_type
        )

        request = documentai.ProcessRequest(
            name=self.processor_name,
            raw_document=raw_document,
            field_mask="text,entities",
        )

        result = self.client.process_document(request=request)
        document = result.document

        return document.text

    def process_id_card(self, face_path: str, back_path: str) -> dict:
        """Process both sides of an ID card and return combined text."""
        face_text = self.process_image(face_path)
        back_text = self.process_image(back_path)

        return {
            "face_text": face_text,
            "back_text": back_text,
            "combined_text": f"=== الوجه (Face) ===\n{face_text}\n\n=== الخلفية (Back) ===\n{back_text}"
        }


document_ai_service = DocumentAIService()
