---
marp: true
theme: default
paginate: true
backgroundColor: "#ffffff"
color: "#1a1a2e"
style: |
  section {
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 28px;
  }
  h1 {
    color: #16213e;
    font-size: 2em;
    border-bottom: 3px solid #0f3460;
    padding-bottom: 10px;
  }
  h2 {
    color: #0f3460;
    font-size: 1.5em;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.75em;
  }
  th {
    background-color: #0f3460;
    color: #ffffff;
    padding: 8px;
  }
  td {
    padding: 8px;
    border: 1px solid #ccc;
  }
  code {
    background: #f4f4f4;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 0.85em;
  }
  pre {
    background: #1e1e2e;
    color: #cdd6f4;
    border-radius: 8px;
    padding: 16px;
    font-size: 0.7em;
  }
  ul li {
    margin-bottom: 6px;
  }
  .highlight {
    color: #e94560;
    font-weight: bold;
  }
---

<!-- _class: lead -->
<!-- _backgroundColor: #16213e -->
<!-- _color: #ffffff -->

# Beyond the Table: NoSQL Web Applications

## Implementing a Scalable Document-Oriented Notes System

<br>

**Course:** CSE323 — Advanced Database Systems
**Deadline:** Monday, 4th May 2026
**Team:** AIU-SoftWave

---

# Agenda

1. Project Overview & Mission
2. Why NoSQL? SQL vs. NoSQL
3. Data Modeling Deep Dive
4. System Architecture
5. API & Data Flow
6. Key Implementation Highlights
7. Challenges & Solutions
8. Scalability & Future Work
9. Live Demo & Q&A

---

# Project Overview

## What is the NoSQL Notes App?

A **full-stack web application** for flexible note management — built to showcase the real-world advantages of **document-oriented NoSQL databases**.

- 📝 Create, read, update, and delete notes with dynamic tags
- 💬 Embed comments directly inside note documents
- 📊 Real-time statistics dashboard powered by MongoDB Aggregation
- 🔍 Full-text search and tag-based filtering
- 📈 Activity feed tracking recent notes and comments

> *"One document. Zero JOINs. Infinite flexibility."*

---

# Why NoSQL? The Problem with SQL

### Modeling Notes in a Relational Database requires:

```
notes       → id, title, content
tags        → id, name
note_tags   → note_id, tag_id   ← Junction table
comments    → id, note_id, text ← Foreign key
```

### Every query = multiple JOINs = slower reads

```sql
SELECT n.*, c.text, t.name
FROM notes n
LEFT JOIN comments c ON c.note_id = n.id
LEFT JOIN note_tags nt ON nt.note_id = n.id
LEFT JOIN tags t ON t.id = nt.tag_id
WHERE n.id = ?;
```

---

# Why NoSQL? The Document Approach

### The same note in MongoDB — **one document, one query**:

```json
{
  "_id": "ObjectId",
  "title": "Database Research",
  "content": "Exploring NoSQL advantages...",
  "tags": ["university", "research", "nosql"],
  "comments": [
    { "content": "Great summary!", "createdAt": "2026-04-27" }
  ],
  "views": 42,
  "createdAt": "2026-04-27"
}
```

✅ **O(1) retrieval** — fetch everything with a single `findById`
✅ **No migrations** — add fields without altering tables

---

# SQL vs. NoSQL Comparison

| Feature | Relational (SQL) | Document (NoSQL) | Our Benefit |
|---|---|---|---|
| **Schema** | Rigid, predefined columns | Dynamic, BSON-based | Notes evolve without migrations |
| **Relationships** | JOINs across tables | Embedded sub-documents | O(1) note + comments retrieval |
| **Scaling** | Vertical (bigger server) | Horizontal (sharding) | Ready for millions of notes |
| **Complexity** | High (Normalized) | Low (maps to objects) | Backend matches UI components |
| **Search** | Full-table scan | Multikey & text indexes | Fast tag/content search |

---

# Data Modeling: The Note Document

### Fields & Design Choices

| Field | Type | Design Rationale |
|---|---|---|
| `_id` | ObjectId | Auto-generated unique identifier |
| `title` | String | Text-indexed for full-text search |
| `content` | String | Text-indexed for full-text search |
| `tags` | Array\<String\> | Multikey index — fast `$in` queries |
| `comments` | Array\<Object\> | Embedded — avoids JOIN, O(1) access |
| `views` | Number | Atomic `$inc` — no race conditions |
| `createdAt` | Date | Used for `newest`/`oldest` sorting |

---

# System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   User / Browser                    │
└──────────────────────┬──────────────────────────────┘
                       │  HTTP
┌──────────────────────▼──────────────────────────────┐
│         Next.js Frontend  (Port 5002)               │
│   React · Tailwind CSS · TanStack Query             │
└──────────────────────┬──────────────────────────────┘
                       │  REST API
┌──────────────────────▼──────────────────────────────┐
│         NestJS Backend API  (Port 5001)             │
│   TypeScript · Mongoose ODM · class-validator       │
└──────────────────────┬──────────────────────────────┘
                       │  MongoDB Wire Protocol
┌──────────────────────▼──────────────────────────────┐
│         MongoDB Database  (Port 27017)              │
│   Document Store · Indexes · Aggregation Pipeline   │
└─────────────────────────────────────────────────────┘
        All tiers containerized via Docker Compose
```

---

# Technology Stack

### Frontend — **Next.js + React**
- TanStack Query for server-state synchronization
- Tailwind CSS for responsive design
- Client-side rendering with Suspense boundaries

### Backend — **NestJS (Node.js + TypeScript)**
- Mongoose ODM for schema-level validation
- `class-validator` global pipes — NoSQL injection prevention
- Swagger/OpenAPI auto-generated docs at `/api/docs`

### Database — **MongoDB**
- Text indexes on `title` + `content`
- Multikey index on `tags` array
- Aggregation Pipeline for server-side analytics

### DevOps — **Docker Compose**

---

# API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/notes` | Create a note |
| `GET` | `/api/notes` | List notes (search, tag, sort) |
| `GET` | `/api/notes/:id` | Get note + auto-increment views |
| `PUT` | `/api/notes/:id` | Update a note |
| `DELETE` | `/api/notes/:id` | Delete a note |
| `POST` | `/api/notes/:id/comments` | Add a comment |
| `GET` | `/api/notes/stats` | Aggregated statistics |
| `GET` | `/api/notes/activity` | Recent activity feed |

> All responses follow: `{ success, data, message }`

---

# Key Feature: Search & Filtering

### GET `/api/notes?tag=nosql&search=database&sort=newest`

```
┌────────────────────────────────────────┐
│  Query Parameters                      │
│  ├── tag    → $in array match          │
│  ├── search → $regex on title/content  │
│  └── sort   → newest | oldest | alpha  │
└────────────────────────────────────────┘
```

- Tag filtering uses **Multikey Index** → O(log n) instead of O(n)
- Text search uses **MongoDB `$regex`** — case-insensitive
- Sorting uses MongoDB `.sort()` on `createdAt` or `title`

---

# Key Feature: Statistics & Activity

### GET `/api/notes/stats` — MongoDB Aggregation Pipeline

```json
{
  "totalNotes": 42,
  "totalComments": 128,
  "totalViews": 1024,
  "tags": [
    { "tag": "research", "count": 10 },
    { "tag": "university", "count": 8 }
  ]
}
```

### GET `/api/notes/activity?limit=10`
- Uses `$unionWith` to merge notes + comments into one feed
- Sorted by `createdAt` descending — **no application-side processing**

---

# Key Feature: Atomic View Counting

### The Problem (SQL approach):
```sql
-- Requires SELECT + UPDATE + possible row lock
SELECT views FROM notes WHERE id = ?;
UPDATE notes SET views = views + 1 WHERE id = ?;
```

### Our Solution (MongoDB `$inc`):
```javascript
// Single atomic operation — zero race conditions
Note.findByIdAndUpdate(id, { $inc: { views: 1 } })
```

✅ **Atomic** — no race conditions even under high concurrency
✅ **Single round-trip** — faster than SQL read-modify-write
✅ **No locking** — other queries are not blocked

---

# Challenges & Solutions

| Challenge | Solution |
|---|---|
| **Data Consistency** | Mongoose Schemas enforce validation at application level while keeping NoSQL flexibility |
| **Concurrency** | MongoDB optimistic locking via `__v` version key prevents lost updates |
| **Search Performance** | Compound text index on `title` + `content`, multikey index on `tags` |
| **View Tracking** | Atomic `$inc` operator — impossible without row locks in SQL |
| **Analytics** | MongoDB Aggregation Pipeline — server-side, no app processing |
| **Security** | `class-validator` pipes prevent NoSQL injection; `.env` secrets |

---

# Scalability: From App to Enterprise

| Scale | Our App | Enterprise Reality |
|---|---|---|
| **Nodes** | Single-node MongoDB | Horizontal sharding across thousands |
| **Writes** | Async, non-blocking | High-velocity autosaves with no table locks |
| **Reads** | Indexed lookups | Global low-latency reads via replicas |
| **Distribution** | Local | Multi-region replica sets |
| **Analytics** | Aggregation Pipeline | Scales with data volume on the DB side |

### Companies using this approach:
> **Netflix** · **LinkedIn** · **Uber** · **Twitter**

*"Our architecture today is already Future-Proof for millions of users."*

---

# Running the Project

### Prerequisites: Docker Desktop

```bash
# 1. Clone the repository
git clone https://github.com/AIU-SoftWave/nosql-notes-app.git

# 2. Start all services with Docker Compose
cd nosql-notes-app/apps
docker compose up -d --build
```

### Access Points:
| Service | URL |
|---|---|
| 🌐 Frontend | http://localhost:5002 |
| ⚙️ Backend API | http://localhost:5001/api |
| 📄 Swagger Docs | http://localhost:5001/api/docs |

---

# Lessons Learned

1. **Query-First Modeling** — Design your documents around how you query, not how data relates
2. **Embedding vs. Referencing** — Embed when you always read together; reference when data grows unbounded
3. **Indexes are Essential** — NoSQL doesn't mean no optimization; index what you filter and sort on
4. **Aggregation Pipeline** — A powerful server-side analytics engine that replaces complex application logic
5. **Atomic Operators** — `$inc`, `$push`, `$pull` enable race-condition-free updates without transactions
6. **Docker Compose** — Reproducible environments saved significant debugging time

---

# Future Work

- 🔐 **Authentication & Authorization** — JWT-based user accounts
- 🌐 **MongoDB Atlas** — Cloud-hosted with global distribution
- 🔀 **Horizontal Sharding** — Distribute data across clusters for massive scale
- 📱 **Mobile App** — React Native frontend
- 🤖 **AI Integration** — Auto-tagging and smart search with embeddings
- 📡 **Real-time Updates** — WebSocket-based live collaboration
- 🔄 **Offline Sync** — Local-first with conflict resolution

---

<!-- _class: lead -->
<!-- _backgroundColor: #16213e -->
<!-- _color: #ffffff -->

# Thank You!

<br>

## Questions?

<br>

**Repository:** github.com/AIU-SoftWave/nosql-notes-app
**Course:** CSE323 — Advanced Database Systems

<br>

> *"The best schema is the one that serves your queries."*

---

<!-- _backgroundColor: #f4f4f4 -->

# How to Export This File to PPTX/PDF

### Option 1 — Marp CLI (Recommended)

```bash
# Install Marp CLI
npm install -g @marp-team/marp-cli

# Export to PowerPoint
marp PRESENTATION_SLIDES.md --pptx --output slides.pptx

# Export to PDF
marp PRESENTATION_SLIDES.md --pdf --output slides.pdf

# Export to HTML
marp PRESENTATION_SLIDES.md --html --output slides.html
```

### Option 2 — VS Code

Install the **Marp for VS Code** extension, open this file, and click **Export Slide Deck** from the command palette (`Ctrl+Shift+P`).
