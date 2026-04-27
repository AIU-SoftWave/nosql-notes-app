# System Architecture

## Overview

The application follows a three-tier architecture:

1. Frontend (Next.js)
2. Backend (NestJS API)
3. Database (MongoDB)

---

## Architecture Diagram (Mermaid)

```mermaid
flowchart LR
    A[User/Browser]
    B[Next.js Frontend]
    C[NestJS Backend API]
    D[MongoDB Database]
    A-->|UI Interaction|B
    B-->|HTTP Request|C
    C-->|Query/Update|D
    D-->|Data|C
    C-->|API Response|B
    B-->|Render/Update|A
```

---

## Components

### Frontend

* Built using Next.js (React framework)
* Handles user interface, routing, and user interactions
* Communicates with backend via HTTP requests (REST API)

### Backend

* Built using NestJS (Node.js framework)
* Handles business logic and validation
* Provides RESTful APIs
* Interacts with MongoDB

### Database

* MongoDB (NoSQL document database)
* Stores notes, comments, tags, and metadata

---

## Data Flow (Mermaid)

```mermaid
sequenceDiagram
    participant U as User
    participant F as Next.js Frontend
    participant B as NestJS Backend
    participant M as MongoDB
    U->>F: Interact (e.g., create note)
    F->>B: HTTP API Request
    B->>M: Query/Update
    M-->>B: Data/Result
    B-->>F: API Response
    F-->>U: UI Update
```

---

## Design Decisions

* Use of NoSQL for flexible schema
* Embedding comments within notes to reduce joins
* REST API for clear separation of concerns
* Next.js for SSR/SPA flexibility
* NestJS for modular, scalable backend
