# Copilot Instructions for This Repository

## Build, Test, and Lint Commands

- **Backend**
  - Install dependencies: `cd backend && pnpm install`
  - Start development server: `pnpm run dev`
  - (No explicit test/lint commands found; add here if implemented)

- **Frontend**
  - Install dependencies: `cd frontend && pnpm install`
  - Start development server: `pnpm start`
  - (No explicit test/lint commands found; add here if implemented)

## High-Level Architecture

- **Three-tier architecture:**
  - **Frontend:** React (or basic HTML/CSS/JS), handles UI and user interactions, communicates with backend via HTTP.
  - **Backend:** Node.js + Express, provides RESTful APIs, handles business logic, interacts with MongoDB.
  - **Database:** MongoDB (NoSQL), stores notes, comments, tags, and activity data.
- **Data Flow:**
  1. User interacts with frontend
  2. Frontend sends HTTP requests to backend API
  3. Backend processes requests and interacts with MongoDB
  4. Backend returns responses to frontend

## Key Conventions

- **Branching:**
  - `main`: stable, production-ready
  - `dev`: integration branch
  - `feature/*`: for new features (e.g., `feature/notes-api`)
- **Pull Requests:**
  - One feature per PR, must be reviewed before merging to `dev`
  - Test features locally before submitting PR
- **Commit Messages:**
  - Use clear, descriptive messages (e.g., "Add create note API", "Fix bug in note deletion")
- **Task Management:**
  - All work tracked via GitHub Issues; assign yourself before starting
- **Database Design:**
  - Notes stored as MongoDB documents
  - Comments embedded within notes
  - Tags as arrays in note documents
  - Views and timestamps stored in each note document
- **API Endpoints:**
  - RESTful endpoints under `/api/notes` (see Docs/api.md for details)

## Documentation
- All documentation is in the `/Docs` folder (architecture, API, database, workflow, SRS, testing, etc.)

---

If you add automated tests or linters, update this file with the relevant commands.
