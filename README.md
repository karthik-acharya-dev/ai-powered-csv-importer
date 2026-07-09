# AI-Powered CSV Importer - GrowEasy Assignment

An end-to-end full-stack application built for the GrowEasy Assignment to intelligently map messy CSV data into standard CRM formats using AI.

## Features & Bonus Points Achieved
- **Next.js & Express Architecture**: Clean separation of concerns.
- **Drag & Drop Upload**: Modern UI using `react-dropzone`.
- **Virtualized Tables**: Capable of previewing massive CSV files instantly using `@tanstack/react-virtual`.
- **Intelligent AI Mapping (Gemini 2.5 Flash)**: Automatically handles unknown column names and enforces strict GrowEasy constraints (e.g., status enums, skip invalid).
- **Batch Processing & Retries**: Robust frontend-to-backend batching with retry mechanisms for rate limits.
- **Progress Indicators**: Real-time feedback during AI extraction.
- **Dark Mode**: System-aware theming using `next-themes`.
- **Dockerized**: Simple 1-command startup.
- **Unit Tests**: Jest tests configured for backend logic.
- **Stateless Backend**: Doesn't require complex DB setups.

## Requirements Checklist
- [x] Accept any CSV
- [x] Responsive Pre-AI Preview Table (Sticky headers, virtualized)
- [x] Intelligent Extraction (Multiple emails -> Notes, Date Formatting)
- [x] Strict Schema matching (Allowed CRM Statuses, Data Sources)
- [x] Post-AI Result Table (Success vs Skipped counts)

---

## Setup Instructions

### Prerequisites
- Node.js v20+ OR Docker Desktop
- A Gemini API Key (get one from [Google AI Studio](https://aistudio.google.com/))

### Method 1: Using Docker (Recommended)
1. Add your `GEMINI_API_KEY` to `backend/.env`.
2. Run `docker-compose up --build`.
3. Open `http://localhost:3000` for the Frontend and `http://localhost:5000/api/health` for the Backend.

### Method 2: Manual Start
**Backend:**
\`\`\`bash
cd backend
npm install
# Ensure you have set your GEMINI_API_KEY in .env
npm run dev
\`\`\`

**Frontend:**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

Open `http://localhost:3000` to interact with the importer.

## Running Tests
In the `backend` directory, run:
\`\`\`bash
npm test
\`\`\`

## Architecture & AI Strategy
1. **Upload**: User drops CSV. Backend's `multer` catches it and `papaparse` processes it entirely in memory, instantly returning the JSON structure to the frontend.
2. **Preview**: Frontend renders a high-performance virtualized table.
3. **Extraction**: User clicks Confirm. Frontend splits records into chunks (50 rows) and sends them to `/api/extract`.
4. **AI Parsing**: The Express backend constructs a strict JSON-schema prompt for Gemini 2.5 Flash, enforcing the enum rules and field appending requirements.
5. **Validation**: The backend runs a final pass filtering out rows that lacked BOTH email and phone number, passing valid records to success and rejected to skipped.

---
*Developed for GrowEasy Software Developer Assignment.*
