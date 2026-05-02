# Notes Application

A full-stack notes application with user authentication, public/private notes, and sorting algorithm performance analysis.

## Features

- **User Authentication**: JWT-based login/register
- **Notes Management**: Create, read, update, delete notes
- **Public/Private Notes**: Notes can be public or private
- **Markdown Support**: Write notes in Markdown
- **Tags**: Organize notes with tags
- **Comments**: Add comments to notes
- **Sorting Algorithms**: Compare Merge Sort, Quick Sort, Bubble Sort, and MongoDB Native
- **Performance Metrics**: View execution time and complexity

## Tech Stack

- **Backend**: NestJS, MongoDB (Mongoose)
- **Frontend**: Next.js 16, React Query
- **Database**: MongoDB

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd apps/backend
npm install

# Create .env file
echo "MONGODB_URI=mongodb://localhost:27017/notes-db
JWT_SECRET=your-secret-key-change-in-production
CORS_ORIGIN=http://localhost:3001" > .env

# Start development server
npm run start:dev
```

Backend runs on http://localhost:5000

### Frontend Setup

```bash
cd apps/frontend
npm install

# Start development server
npm run dev
```

Frontend runs on http://localhost:3001

## Usage

1. Register a new user at `/register`
2. Login at `/login`
3. Create notes at `/notes/new`
4. Toggle `isPublic` to make notes visible to others
5. View all notes at `/notes`
6. Check statistics at `/stats`

## API Documentation

Swagger docs available at http://localhost:5000/api/docs

## Project Structure

```
apps/
├── backend/           # NestJS API
│   └── src/
│       ├── auth/    # JWT auth
│       ├── notes/   # Notes CRUD
│       └── entities/
└── frontend/       # Next.js UI
    └── app/
        ├── notes/  # Notes pages
        └── lib/   # API client
```