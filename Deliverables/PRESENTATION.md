---
marp: true
theme: default
paginate: true
style: |
  section {
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 22px;
    background: #ffffff;
    color: #1a1a2e;
    padding: 48px 64px;
  }
  section.title-slide {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
  section.title-slide h1 {
    font-size: 48px;
    font-weight: 800;
    color: #e94560;
    margin-bottom: 8px;
  }
  section.title-slide h2 {
    font-size: 26px;
    font-weight: 400;
    color: #a8dadc;
    margin-bottom: 40px;
  }
  section.title-slide p {
    color: #ccc;
    font-size: 18px;
    line-height: 1.8;
  }
  h1 {
    font-size: 36px;
    color: #0f3460;
    border-bottom: 3px solid #e94560;
    padding-bottom: 10px;
    margin-bottom: 24px;
  }
  h2 {
    font-size: 26px;
    color: #16213e;
    margin-top: 18px;
    margin-bottom: 8px;
  }
  h3 {
    font-size: 20px;
    color: #e94560;
    margin-top: 14px;
    margin-bottom: 6px;
  }
  ul {
    line-height: 1.9;
    padding-left: 24px;
  }
  li {
    margin-bottom: 4px;
  }
  code {
    background: #f0f4ff;
    border-radius: 4px;
    padding: 2px 7px;
    font-size: 0.9em;
    color: #0f3460;
  }
  pre {
    background: #1a1a2e;
    color: #e2e8f0;
    border-radius: 8px;
    padding: 20px 24px;
    font-size: 16px;
    overflow: auto;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 18px;
    margin-top: 12px;
  }
  th {
    background: #0f3460;
    color: #ffffff;
    padding: 10px 14px;
    text-align: left;
  }
  td {
    padding: 9px 14px;
    border-bottom: 1px solid #e2e8f0;
  }
  tr:nth-child(even) td {
    background: #f7f9fc;
  }
  .badge {
    display: inline-block;
    background: #e94560;
    color: #fff;
    border-radius: 12px;
    padding: 3px 12px;
    font-size: 14px;
    font-weight: 600;
    margin-right: 6px;
    vertical-align: middle;
  }
  footer {
    font-size: 14px;
    color: #888;
  }
  section.section-divider {
    background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section.section-divider h1 {
    color: #e94560;
    border: none;
    font-size: 52px;
  }
  section.section-divider p {
    color: #a8dadc;
    font-size: 22px;
  }
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    margin-top: 12px;
  }
  .card {
    background: #f0f4ff;
    border-left: 4px solid #e94560;
    border-radius: 6px;
    padding: 14px 18px;
    margin-bottom: 10px;
  }
  .highlight {
    color: #e94560;
    font-weight: 700;
  }
---

<!-- _class: title-slide -->

# Beyond the Table: NoSQL Web Applications

## Implementing a Scalable Document-Oriented Notes System

**Course:** CSE323 — Advanced Database Systems
**Team:** AIU SoftWave
**Date:** May 2026

---

<!-- footer: CSE323 · Advanced Database Systems · AIU SoftWave -->

# Agenda

1. 🎯 Project Mission & Goals
2. ⚖️ SQL vs. NoSQL — Why We Switched
3. 🗄️ Data Modeling Deep Dive
4. 🏗️ Full-Stack Architecture
5. 🔄 Data Flow: UI → Document
6. 🛡️ Overcoming NoSQL Challenges
7. ⚙️ Technical Implementation (CRUD + APIs)
8. 🚀 Scalability & Enterprise Reality
9. ✅ Conclusion & Future Work

---

# 🎯 Project Mission

<div class="card">
<strong>Problem:</strong> Rigid relational schemas slow down modern, content-heavy web applications that need flexible, semi-structured data.
</div>

## What We Built

A **full-stack Notes & Knowledge Management System** that demonstrates the real-world advantages of document-oriented storage.

## Core Technologies

| Layer | Technology | Role |
|-------|-----------|------|
| **Frontend** | Next.js 16 + React 19 | UI & Client-Side Rendering |
| **Backend** | NestJS 11 + TypeScript | REST API & Business Logic |
| **Database** | MongoDB + Mongoose 9 | Document Storage & Querying |

> 🎯 **Goal:** Prove that NoSQL is not just a trend — it is a deliberate engineering choice for scalable, flexible applications.

---

# ⚖️ SQL vs. NoSQL — Why We Switched

## The Relational Problem

In a traditional RDBMS, a simple "Note with Comments & Tags" requires **3 tables + 2 JOINs** for every single read.

```
SELECT n.*, c.text, t.name
FROM   notes n
JOIN   comments c ON c.note_id = n.id
JOIN   note_tags nt ON nt.note_id = n.id
JOIN   tags t ON t.id = nt.tag_id
WHERE  n.id = ?;
```

## The NoSQL Solution

One document. One read. **O(1) retrieval.**

| Criterion | Relational (SQL) | Document-Oriented (NoSQL) | Our Benefit |
|-----------|-----------------|--------------------------|-------------|
| **Schema** | Rigid, predefined columns | Dynamic, BSON-based | Notes evolve without migrations |
| **Relationships** | JOINs across tables | Embedded sub-documents | O(1) note + comments retrieval |
| **Scaling** | Vertical (bigger server) | Horizontal (sharding) | Ready for millions of notes |
| **Dev Velocity** | ORM mapping overhead | Data = JSON objects | Backend code matches UI models |

---

# 🗄️ Data Modeling Deep Dive

## The Note Document

```json
{
  "_id":       "ObjectId('664fa1...')",
  "title":     "Dynamic Programming Patterns",
  "content":   "A collection of DP techniques...",
  "tags":      ["algorithms", "dp", "interview"],
  "comments":  [
    { "user": "Ahmad", "text": "Great breakdown!", "date": "2026-04-27" },
    { "user": "Sara",  "text": "Added to my list.", "date": "2026-04-28" }
  ],
  "views":     42,
  "createdAt": "2026-04-26T10:00:00Z",
  "updatedAt": "2026-04-28T14:30:00Z"
}
```

## Why This Model Wins

- 🔵 **Embedded Comments** — no JOIN needed; entire note is one MongoDB document
- 🔵 **Tags as Arrays** — `$push` / `$pull` for atomic tag edits; multikey index for fast lookups
- 🔵 **Text Indexes** — compound index on `title` + `content` enables full-text search
- 🔵 **`$inc` Operator** — atomic view-count increment; zero race conditions

---

# 🔵 3NF (SQL) vs. Aggregated Document (NoSQL)

<div class="two-col">

**Relational — 3rd Normal Form**

```
┌──────────┐    ┌──────────────┐
│  notes   │    │   comments   │
│──────────│    │──────────────│
│ id   PK  │◄───│ note_id  FK  │
│ title    │    │ user         │
│ content  │    │ text         │
└──────────┘    └──────────────┘
      │
┌─────┴──────┐    ┌──────┐
│ note_tags  │    │ tags │
│────────────│    │──────│
│ note_id FK │───►│ id   │
│ tag_id  FK │    │ name │
└────────────┘    └──────┘
```

**Document — Aggregated Model**

```
┌──────────────────────────┐
│  notes (single document) │
│──────────────────────────│
│ _id, title, content      │
│ tags: ["dp", "algo"]     │
│ comments: [              │
│   { user, text, date },  │
│   { user, text, date }   │
│ ]                        │
│ views, createdAt         │
└──────────────────────────┘
```

</div>

> ✅ **Result:** 1 document fetch replaces 3-table JOIN query

---

# 🏗️ Full-Stack Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                       │
│           Next.js 16  ·  React 19  ·  TanStack Query        │
└───────────────────────────┬─────────────────────────────────┘
                            │  HTTP / REST
┌───────────────────────────▼─────────────────────────────────┐
│                      BACKEND API LAYER                      │
│        NestJS 11  ·  TypeScript  ·  Mongoose ODM            │
│                                                             │
│   /api/notes   /api/notes/:id   /stats   /activity          │
└───────────────────────────┬─────────────────────────────────┘
                            │  MongoDB Wire Protocol
┌───────────────────────────▼─────────────────────────────────┐
│                     MONGODB DATABASE                        │
│   Collection: notes  ·  Text Indexes  ·  Aggregation        │
└─────────────────────────────────────────────────────────────┘
```

## Key Features Delivered

- 📊 **Stats Dashboard** — `/stats` endpoint using MongoDB Aggregation Pipeline
- 📰 **Activity Feed** — recent notes & comments via `$unionWith`
- 🔢 **Sortable Lists** — `newest` / `oldest` / `alphabetical` via MongoDB `sort()`
- 🔍 **Full-Text Search** — regex + text index on `title` and `content`

---

# 🔄 Data Flow: From UI Interaction to Stored Document

## Example: Creating a New Note

```
User fills form
      │
      ▼
Next.js validates input (client-side)
      │  POST /api/notes  { title, content, tags }
      ▼
NestJS receives request
  → class-validator Pipes enforce schema (title required, min length, etc.)
  → Mongoose transforms JSON → BSON document
      │  insertOne({ title, content, tags, views:0, createdAt, updatedAt })
      ▼
MongoDB stores document in notes collection
  → Multikey index updated for new tags
  → Text index updated for title + content
      │  201 Created  { success: true, data: { _id, title, ... } }
      ▼
TanStack Query invalidates cache → UI re-renders with new note
```

> **Key Insight:** The JSON object the developer writes in React is **identical** to the BSON document stored in MongoDB. Zero impedance mismatch.

---

# 🛡️ Overcoming NoSQL Challenges

## Challenge 1 — Data Consistency

**Problem:** No foreign key constraints in MongoDB.
**Solution:** Mongoose Schema-level validation with `class-validator` Pipes in NestJS.

```typescript
// Mongoose enforces this before any write reaches the database
const NoteSchema = new Schema({
  title:   { type: String, required: true, minlength: 1 },
  content: { type: String, required: true },
  tags:    { type: [String], default: [] },
  views:   { type: Number, default: 0, min: 0 },
});
```

## Challenge 2 — Concurrency Control

**Problem:** Simultaneous updates can overwrite data.
**Solution:** Mongoose `__v` version key provides **optimistic locking** — conflicting writes are rejected.

## Challenge 3 — Search Performance

**Problem:** Full-collection scan on large datasets.
**Solution:** Compound text index on `title` + `content`, multikey index on `tags` — queries use the index, not a full scan.

---

# ⚙️ Technical Implementation — CRUD & APIs

## Complete API Surface

| Method | Endpoint | MongoDB Operation | Special Feature |
|--------|----------|------------------|----------------|
| `GET` | `/api/notes` | `find()` + `sort()` | Tag filter, text search, 3 sort modes |
| `GET` | `/api/notes/:id` | `findByIdAndUpdate` | Atomic `$inc views` on every read |
| `POST` | `/api/notes` | `insertOne()` | Schema validation via Mongoose |
| `PUT` | `/api/notes/:id` | `findByIdAndUpdate` | Partial update, `$set` operator |
| `DELETE` | `/api/notes/:id` | `deleteOne()` | Hard delete |
| `POST` | `/api/notes/:id/comments` | `$push` | Embedded sub-document append |
| `GET` | `/api/notes/stats` | `aggregate()` | Aggregation Pipeline |
| `GET` | `/api/notes/activity` | `aggregate($unionWith)` | Cross-collection merge |

## Aggregation Pipeline — Stats Endpoint

```javascript
[
  { $group: { _id: null, totalNotes: { $sum: 1 },
              totalViews: { $sum: "$views" },
              totalComments: { $sum: { $size: "$comments" } } } },
  { $unwind: "$tags" },
  { $group: { _id: "$tags", count: { $sum: 1 } } },
  { $sort:  { count: -1 } }
]
```

---

# 🚀 Scalability & Enterprise Reality

## Our App Today vs. Enterprise Scale

| Dimension | Our Implementation | Enterprise (MongoDB Atlas) |
|-----------|-------------------|--------------------------|
| **Nodes** | Single-node dev server | Thousands of shards |
| **Writes** | Sequential REST calls | Millions of concurrent writes/sec |
| **Distribution** | Local / single region | Multi-region replica sets |
| **Analytics** | Aggregation Pipeline | Real-time Atlas Data API |
| **HA** | Manual restart | Auto-failover replica sets |

## Why NoSQL Scales Where SQL Struggles

- **Horizontal Sharding** — Distribute the `notes` collection across N nodes by `_id` range; queries route to the correct shard automatically — no application changes needed.
- **Low-Latency Writes** — Writes do not acquire table-level locks. Autosave features (every keystroke) are viable.
- **Atomic Counters** — `$inc` on `views` is a single atomic opcode; no `SELECT … FOR UPDATE` needed.
- **Aggregation at Scale** — The same Aggregation Pipeline that powers `/stats` runs on a 100 TB cluster with the same syntax.

> 🏢 **Real-world users:** Netflix, LinkedIn, Uber, and eBay chose MongoDB for exactly these reasons.

---

# ✅ Conclusion & Future Work

## What We Demonstrated

<div class="two-col">

**✅ Achieved**
- Full CRUD with embedded sub-documents
- Zero-JOIN comment & tag retrieval
- Atomic view counting (`$inc`)
- Server-side stats via Aggregation Pipeline
- Full-text search with compound text index
- Activity Feed via `$unionWith`
- Input sanitisation against NoSQL injection
- Consistent JSON error responses

**🔭 Future Roadmap**
- JWT-based authentication & user accounts
- Horizontal sharding demo (MongoDB Atlas)
- Real-time collaboration via WebSockets
- Rate limiting & request throttling
- CI/CD pipeline with automated testing
- Containerised deployment (Docker + K8s)
- GraphQL API layer over MongoDB

</div>

## Key Takeaway

> *"NoSQL is not about removing structure — it is about placing structure **where queries need it**, not where a normalisation textbook demands it."*

By modeling data around **access patterns** rather than entity relationships, we achieve **O(1) reads**, **schema-less evolution**, and a path to **infinite horizontal scale**.

---

<!-- _class: section-divider -->

# Thank You

**Questions & Discussion**

---

**Repository:** `AIU-SoftWave / nosql-notes-app`
**Course:** CSE323 · Advanced Database Systems
**Deadline:** Monday, 4th May 2026

---

> 📎 **How to render this presentation:**
> - **Marp for VS Code** — Install the *Marp for VS Code* extension, open this file, and click the preview/export button to generate PDF or HTML slides.
> - **Marp CLI** — `npx @marp-team/marp-cli PRESENTATION.md --pdf`
> - **Google Slides / PowerPoint** — Copy each slide section into your preferred tool manually.
