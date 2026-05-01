# NoSQL Notes Application - System Design

## Project Deliverables

This document addresses **Deliverable 2: System Design** - Architectural diagrams illustrating web application components and their interactions, with focus on NoSQL database integration.

---

## System Architecture

```mermaid
graph TD
    User[User] -->|HTTPS| Frontend
    Frontend -->|HTTP| Backend
    Backend -->|MongoDB| Database
    
    subgraph Frontend["Frontend (Next.js)"]
        Frontend[Web Browser Interface]
    end
    
    subgraph Backend["Backend (NestJS)"]
        API[REST API]
        Service[Business Logic]
    end
    
    subgraph Database["Database (MongoDB)"]
        Collection[Notes Collection]
    end
```

---

## Component Interactions

### Create Note Flow
```mermaid
sequenceDiagram
    User->>Frontend: Enter note data
    Frontend->>Backend: POST /api/notes
    Backend->>Database: insertOne()
    Database-->>Backend: Document created
    Backend-->>Frontend: 201 Success
    Frontend-->>User: Note created
```

### View Note Flow (with view counter)
```mermaid
sequenceDiagram
    User->>Frontend: Click note
    Frontend->>Backend: GET /api/notes/:id
    Backend->>Database: findByIdAndUpdate($inc: views)
    Database-->>Backend: Note returned
    Backend-->>Frontend: Note with views
    Frontend-->>User: Display note
```

### Get Statistics Flow
```mermaid
sequenceDiagram
    User->>Frontend: View stats
    Frontend->>Backend: GET /api/notes/stats
    Backend->>Database: aggregate()
    Database-->>Backend: Statistics
    Backend-->>Frontend: Dashboard data
    Frontend-->>User: Show stats
```

### Sorting Algorithm Flow
```mermaid
sequenceDiagram
    User->>Frontend: Select algorithm & sort
    Frontend->>Backend: GET /notes?algorithm=merge&sort=newest
    Backend->>Database: fetch data
    Database-->>Backend: Raw data
    Backend->>Backend: Apply Merge Sort
    Backend-->>Frontend: Sorted + Performance metrics
    Frontend-->>User: Display notes + timing
```

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 16, React 19, TanStack Query |
| Backend | NestJS 11 |
| Database | MongoDB |
| ODM | Mongoose 9 |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/notes | List notes (paginated) |
| GET | /api/notes?sort=...&algorithm=... | Sort & filter notes |
| GET | /api/notes/:id | Get note (+ view count) |
| POST | /api/notes | Create note |
| PUT | /api/notes/:id | Update note |
| DELETE | /api/notes/:id | Delete note |
| POST | /api/notes/:id/comments | Add comment |
| GET | /api/notes/stats | Get statistics |
| GET | /api/notes/activity | Get activity feed |
| GET | /api/sort/algorithms | Get sort algorithms |
| POST | /api/seed/notes/:count | Seed random notes |
| POST | /api/seed/clear | Clear all notes |
| GET | /api/seed/count | Get note count |

---

## Sorting Algorithms

| Algorithm | Time | Space | Stable | Description |
|-----------|------|--------|--------|-------------|
| Merge Sort | O(n log n) | O(n) | Yes | Divide and conquer, stable |
| Quick Sort | O(n log n) avg | O(log n) | No | Fast average case |
| Bubble Sort | O(n²) | O(1) | Yes | Simple, educational |
| MongoDB | O(log n) | O(1) | Yes | Database native |

---

## Pagination & Performance

- **Pagination:** `?page=1&limit=10` (max 100)
- **Performance Metrics:** Returned in each response
  - Execution time (ms)
  - Algorithm name
  - Time complexity
  - Space complexity
  - Stability

---

## Data Flow with Performance Tracking

```mermaid
flowchart LR
    Request[API Request] --> Validate[Validate Params]
    Validate --> Fetch[Fetch from MongoDB]
    Fetch --> Sort{Sort Algorithm}
    Sort -->|Custom| JS_Sort[JavaScript Sort]
    Sort -->|MongoDB| DB_Sort[MongoDB Sort]
    JS_Sort --> Measure[Measure Time]
    DB_Sort --> Measure
    Measure --> Response[Return + Metrics]
```