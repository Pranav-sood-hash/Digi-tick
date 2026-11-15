# Digitick — Smart Household Shopping Management Platform
> **Tagline:** *Your Shopping. Organized. Simplified.*

Digitick is a modern, responsive, full-stack web application designed to replace scattered handwritten notes, lost paper lists, and forgotten household groceries.

---

## Key Features

1. **Smart Shopping Lists**
   - **Automatic Starter List:** When a new user registers, an initial "Weekly Essentials" shopping list is provisioned instantly.
   - **Multi-List Management:** Create, rename, duplicate, and archive multiple shopping lists (e.g. Weekly Groceries, Kitchen Essentials, Monthly Pantry).
   - **Dual Input Methods:**
     - **Comma-Separated Input:** Quickly type or paste `"2 kg Apple, Banana, 2 packets Milk, 1 loaf Bread, 5 Eggs"` — Digitick automatically splits entries and extracts quantities, units, and categories.
     - **Individual Item Addition:** Comprehensive modal with product name, quantity stepper, unit selector, category picker, and optional notes.
   - **Real-time Item Tracking & Optimistic UI:** Interactive checkboxes with strikethrough, instant progress bar updates, quantity adjustments, and mistake-reversal.
   - **Trip Completion Celebration:** Prompt to archive finished trips directly into history.

2. **AI-Powered Paper List Scanner**
   - **Camera & Upload:** Capture photos using the mobile rear-facing camera (`facingMode: 'environment'`) or desktop webcam, or drag-and-drop image files.
   - **OCR & Vision AI:** Integrates with Google Gemini Vision API / Google Cloud Vision to transcribe handwriting into structured grocery items.
   - **Transparent Fallback:** When external AI keys are not configured, a heuristic handwriting parser provides realistic extraction with a clear development banner.
   - **Review Before Saving:** Never auto-saves unverified OCR results — users can edit, delete, add missing items, and select whether to create a new list or append to an existing one.

3. **Completed Shopping Lists & Templates**
   - **History Archive:** Review past grocery trips with purchase dates and item counts.
   - **1-Click List Reuse:** Replicates a past completed list into a fresh active list with all items reset to pending, preserving quantities and categories.
   - **Print & PDF Export:** Clean printable CSS styling and instant PDF generation.

4. **Nearby Store Discovery & Category Matching**
   - **Location-Aware:** Requests GPS location or allows manual neighborhood lookup.
   - **Category-Based Product Matching:** Matches unpurchased list items against store business types (e.g., Vegetable Shop -> Produce; Bakery -> Bread, Pastries; Supermarket -> All).
   - **Mandatory Disclaimer Banner:** Transparently alerts users that suggested products are based on store business categories, as Google Maps does not guarantee live store inventory.
   - **One-Click Navigation:** Directly launches Google Maps directions for the selected store.

5. **Apple-Style Minimal Design & Accessibility**
   - Full **Dark Mode** and **Light Mode** support with smooth transitions.
   - Fully responsive across desktop, tablet, and mobile devices (including compact bottom navigation for one-thumb mobile use).

---

## Technology Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide React icons, Framer Motion.
- **Backend:** Python 3.12, FastAPI, REST API architecture, Pydantic v2 validation.
- **Database:** Supabase PostgreSQL with Row Level Security (RLS) policies, indexes, and trigger functions. Includes an automatic local SQLite fallback for standalone zero-config development.
- **AI & OCR:** Google Cloud Vision / Gemini 1.5 Flash Vision integration.
- **Maps:** Google Maps JavaScript API, Google Places API, and Directions API with interactive visual radar fallback.

---

## Project Structure

```
Digitick/
├── backend/
│   ├── app/
│   │   ├── config.py             # Settings & environment variables
│   │   ├── database.py           # SQLAlchemy database session & engine
│   │   ├── main.py               # FastAPI application & CORS
│   │   ├── models/               # SQLAlchemy ORM models (User, List, Item, Document, Activity)
│   │   ├── schemas/              # Pydantic validation schemas
│   │   ├── services/             # Auth, List CRUD, OCR AI, and Store matching services
│   │   ├── utils/                # Category detection & quantity parser
│   │   └── routers/              # API endpoints (/auth, /lists, /items, /ocr, /stores, /dashboard)
│   ├── tests/
│   │   └── test_api.py           # Pytest test suite
│   ├── supabase_schema.sql       # Full PostgreSQL RLS & trigger schema for Supabase
│   ├── .env.example
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/           # Button, Input, Modal, Badge, ProgressBar, DisclaimerBanner
    │   │   ├── layout/           # Sidebar, Header, MobileNav, Layout
    │   │   ├── dashboard/        # WelcomeBanner, StatsOverview
    │   │   ├── lists/            # ListCard, ItemRow, CommaInputModal, AddItemModal
    │   │   ├── scanner/          # CameraCapture, OCRReviewTable
    │   │   └── stores/           # StoreCard, InteractiveMap
    │   ├── context/              # AuthContext, ThemeContext, ToastContext
    │   ├── pages/                # Dashboard, Lists, ListDetail, Scanner, Completed, Stores, Profile, Settings, Auth
    │   ├── services/             # API client, Supabase client
    │   └── types/                # TypeScript interfaces
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts
```

---

## Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ & pnpm (or npm)

### 2. Backend Setup
```bash
cd backend

# Create or activate virtual environment (optional)
# python -m venv venv
# .\venv\Scripts\activate

# Install dependencies (already satisfied if installed globally)
pip install -r requirements.txt

# Run automated test suite
python -m pytest -v

# Start the FastAPI server
uvicorn app.main:app --reload --port 8000
```
API Documentation will be available at: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
pnpm install

# Build verification
pnpm run build

# Start development server
pnpm dev
```
The application will be running at: `http://localhost:5173`

---

## Demo Account
You can register a new account or click the **"1-Click Demo Evaluation Login"** button on the sign-in screen to instantly explore all features:
- **Email:** `demo@digitick.com`
- **Password:** `Digitick2026!`

---

## Connecting Supabase (Optional)
To connect your live Supabase cloud project:
1. Open the [Supabase Dashboard](https://supabase.com).
2. Create a project and navigate to the **SQL Editor**.
3. Copy and run the entire contents of [`backend/supabase_schema.sql`](backend/supabase_schema.sql).
4. Update `DATABASE_URL` in `backend/.env` with your Supabase PostgreSQL connection string.

