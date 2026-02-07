# Egyptian National ID Scanner

Extract structured data from Egyptian National ID cards using a multi-stage AI pipeline: Google Document AI for OCR, OpenAI for text correction and field extraction, with a modern Next.js frontend.

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16 (App Router) | Modern React-based UI |
| | TypeScript | Type safety |
| | Tailwind CSS v4 | Styling & dark theme |
| | Lucide React | Icons |
| | Sonner | Toast notifications |
| **Backend** | FastAPI (Python) | REST API server |
| | Pydantic | Data validation & models |
| | Uvicorn | ASGI server |
| **OCR** | Google Document AI | Arabic text extraction from images |
| **AI** | OpenAI GPT-4.1-nano | OCR text correction & field extraction |
| **Database** | Convex | Serverless real-time database |

## Processing Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js Frontend (:3000)                    │
│  Upload face + back images  ──►  Display extracted fields       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    POST /upload
                    POST /process/{id}
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   FastAPI Backend (:8000)                        │
│                                                                 │
│  ┌───────────────────┐                                          │
│  │  Google Document   │                                         │
│  │       AI           │──► Raw OCR Text (Arabic)                │
│  │     (OCR)          │                                         │
│  └────────┬──────────┘                                          │
│           │                                                     │
│           ▼                                                     │
│  ┌───────────────────┐                                          │
│  │     OpenAI         │                                         │
│  │   gpt-4.1-nano    │──► Corrected Text (جمهوريهمصل → جمهوريه مصر) │
│  │   (Fixer)          │                                         │
│  └────────┬──────────┘                                          │
│           │                                                     │
│           ▼                                                     │
│  ┌───────────────────┐                                          │
│  │     OpenAI         │                                         │
│  │   gpt-4.1-nano    │──► Structured JSON (9 fields)            │
│  │  (Extractor)       │                                         │
│  └────────┬──────────┘                                          │
│           │                                                     │
│           ▼                                                     │
│  ┌───────────────────┐                                          │
│  │     Convex         │                                         │
│  │    Database        │──► Stored Record                        │
│  └───────────────────┘                                          │
└─────────────────────────────────────────────────────────────────┘
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
| Job | الوظيفة |

## Installation

```bash
# 1. Clone & install Python dependencies
uv add fastapi uvicorn python-multipart google-cloud-documentai openai convex python-dotenv

# 2. Install Convex
npm install
npx convex dev

# 3. Install Next.js frontend
cd frontend
npm install
```

## Configuration

Copy `.env.example` to `.env` and fill in your values:

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

# Terminal 2: FastAPI backend
uv run uvicorn main:app --reload

# Terminal 3: Next.js frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload` | Upload face + back images (multipart/form-data) |
| POST | `/process/{upload_id}` | Process images & extract data |
| GET | `/results` | Get all stored records |
| GET | `/results/{id}` | Get single record |

## Project Structure

```
IdInsights/
├── main.py                     # FastAPI app + CORS + routes
├── services/
│   ├── document_ai.py          # Google Document AI OCR
│   ├── openai_fixer.py         # OpenAI text correction & extraction
│   └── convex_db.py            # Convex database operations
├── models/
│   └── id_card.py              # Pydantic data models
├── convex/
│   ├── schema.ts               # Database schema (idCards table)
│   └── documents.ts            # Mutations & queries
├── public/
│   └── index.html              # Legacy test UI
├── uploads/                    # Uploaded images (gitignored)
│
└── frontend/                   # Next.js 16 App
    ├── app/
    │   ├── layout.tsx           # Root layout (RTL, dark mode)
    │   ├── page.tsx             # Home — upload & process
    │   └── history/
    │       ├── page.tsx         # All records (grid/table, search)
    │       └── [id]/page.tsx    # Single record detail
    ├── components/
    │   ├── navbar.tsx           # Navigation bar
    │   ├── upload-zone.tsx      # Drag & drop image upload
    │   ├── processing-status.tsx # 3-step progress indicator
    │   ├── results-card.tsx     # Extracted data display
    │   └── skeleton-card.tsx    # Loading skeleton
    ├── lib/
    │   ├── api.ts               # API service layer
    │   ├── types.ts             # TypeScript interfaces
    │   └── utils.ts             # Utility functions
    ├── next.config.ts           # API proxy to FastAPI
    ├── tailwind.config.ts       # Tailwind dark theme
    └── package.json
```
