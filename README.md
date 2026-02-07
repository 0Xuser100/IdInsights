# Egyptian National ID Scanner

Extract data from Egyptian National ID cards using Google Document AI + OpenAI.

## Workflow

```
Upload Images (face + back)
        │
        ▼
┌───────────────────┐
│  Google Document  │
│       AI          │──► Raw OCR Text
│     (OCR)         │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│     OpenAI        │
│     gpt-4.1-nano  │──► Fixed Text (جمهوريهمصل → جمهوريه مصر)
│  -2025-04-14      │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│     OpenAI        │
│     gpt-4.1-nano  │──► Structured JSON
│  -2025-04-14      │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│     Convex        │
│    Database       │──► Stored Record
└───────────────────┘
```

## Extracted Fields

| Field | Arabic |
|-------|--------|
| Name | الاسم |
| National ID | الرقم القومي |
| Address | العنوان |
| Date of Birth | تاريخ الميلاد |
| Gender | النوع |
| Religion | الديانة |
| Marital Status | الحالة الزوجية |
| Expiry Date | ساريه حتي |

## Installation

```bash
# 1. Install Python dependencies
uv add fastapi uvicorn python-multipart google-cloud-documentai openai convex python-dotenv

# 2. Install Convex
npm install
npx convex dev
```

## Configuration

Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

```env
GOOGLE_APPLICATION_CREDENTIALS=<your-service-account.json>
GCP_PROJECT_ID=<from Google Cloud Console>
GCP_LOCATION=us
GCP_PROCESSOR_ID=<from Document AI Console>
OPENAI_API_KEY=<from platform.openai.com>
CONVEX_URL=<from npx convex dev>
```

## Run

```bash
# Terminal 1: Convex (keep running)
npx convex dev

# Terminal 2: FastAPI
uv run uvicorn main:app --reload
```

Open http://localhost:8000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload` | Upload face + back images |
| POST | `/process/{upload_id}` | Process images & extract data |
| GET | `/results` | Get all records |
| GET | `/results/{id}` | Get single record |

## Project Structure

```
IdInsights/
├── main.py                 # FastAPI app
├── services/
│   ├── document_ai.py      # Google Document AI
│   ├── openai_fixer.py     # OpenAI text correction
│   └── convex_db.py        # Database operations
├── models/
│   └── id_card.py          # Pydantic models
├── convex/
│   ├── schema.ts           # Database schema
│   └── documents.ts        # Mutations & queries
├── public/
│   └── index.html          # Test UI
└── uploads/                # Uploaded images
```
