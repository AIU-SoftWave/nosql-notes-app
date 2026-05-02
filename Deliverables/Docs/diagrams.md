# NoSQL Notes Application - System Design

## Project Deliverables

This document addresses **Deliverable 2: System Design** - Architectural diagrams illustrating web application components and their interactions, with focus on NoSQL database integration.

---

## Use Case Diagram

Shows all user interactions with the system.

```mermaid
graph TD
    User[User]

    subgraph Application["NoSQL Notes Application"]
        UC1[Register Account]
        UC2[Login]
        UC3[Create Note]
        UC4[View Notes List]
        UC5[View Note Details]
        UC6[Edit Note]
        UC7[Delete Note]
        UC8[Add Comment]
        UC9[Search Notes]
        UC10[Filter by Tags]
        UC11[Sort Notes]
        UC12[View Statistics]
        UC13[View Activity Feed]
    end

    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC8
    User --> UC9
    User --> UC10
    User --> UC11
    User --> UC12
    User --> UC13

    UC2 -.-> UC3
    UC2 -.-> UC6
    UC2 -.-> UC7
    UC2 -.-> UC8

    style Application fill:#e1f5ff
```

---

## Deployment Architecture

Shows Docker containers, ports, volumes, and networking.

```mermaid
graph TD
    Compose[docker-compose.yml] --> FE[Frontend Container<br/>Next.js 16<br/>Port: 3001]
    Compose --> BE[Backend Container<br/>NestJS 11<br/>Port: 5000]
    Compose --> DB[Database Container<br/>MongoDB<br/>Port: 27017]
    Compose --> Net[notes-network]

    FE --> Net
    BE --> Net
    DB --> Net

    FE -->|HTTP 3001→5000| BE
    BE -->|MongoDB Protocol<br/>5000→27017| DB

    style FE fill:#e1f5ff
    style BE fill:#f5e1ff
    style DB fill:#f5e1ff
    style Net fill:#fff5e1
```

---

## System Architecture

```mermaid
graph TD
    User[User] -->|HTTPS| Frontend
    Frontend -->|HTTP| SecurityLayer
    SecurityLayer -->|Filtered| Backend
    Backend -->|MongoDB| Database

    subgraph Frontend["Frontend (Next.js)"]
        Frontend[Web Browser Interface]
    end

    subgraph SecurityLayer["Security Layer"]
        Helmet[Helmet Headers<br/>CSP, HSTS, X-Frame]
        RateLimit[Rate Limiter<br/>100req/15min]
        AuthLimit[Auth Rate Limiter<br/>5req/15min]
    end

    subgraph Backend["Backend (NestJS)"]
        API[REST API]
        JWT[JWT Guard]
        Validation[Input Validation<br/>@Transform Sanitization]
        Service[Business Logic]
    end

    subgraph Database["Database (MongoDB)"]
        Collection[Notes Collection]
        Indexes[Compound & Text Indexes]
    end

    Helmet --> RateLimit
    RateLimit --> AuthLimit
    AuthLimit --> API
    API --> JWT
    JWT --> Validation
    Validation --> Service
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

### Security Flow (Defense in Depth)

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Helmet
    participant RateLimiter
    participant Backend
    participant Validation
    participant Database

    User->>Frontend: Submit form with <script>alert('xss')</script>
    Frontend->>Helmet: HTTPS Request
    Helmet->>Helmet: Add Security Headers (CSP, HSTS, X-Frame)
    Helmet->>RateLimiter: Check Request Count
    RateLimiter->>RateLimiter: Within limit? (100/15min)
    RateLimiter->>Backend: Forward Request
    Backend->>Validation: Validate & Sanitize Input
    Validation->>Validation: Strip <script> tags
    Validation->>Validation: Check max lengths
    Validation->>Database: Store sanitized data
    Database-->>Backend: Success
    Backend-->>RateLimiter: Response
    RateLimiter-->>Helmet: Response
    Helmet-->>Frontend: Security Headers + Data
    Frontend-->>User: Display (XSS prevented)
```

### Authentication Flow (JWT)

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Security
    participant Backend
    participant AuthService
    participant MongoDB

    User->>Frontend: Enter credentials
    Frontend->>Security: POST /api/auth/login
    Security->>Security: Check rate limit (5/15min)
    Security->>Backend: Forward request
    Backend->>AuthService: login(dto)
    AuthService->>MongoDB: Find user by username
    MongoDB-->>AuthService: User document
    AuthService->>AuthService: Compare password (bcrypt)
    AuthService->>AuthService: Generate JWT (7-day expiry)
    AuthService-->>Backend: { accessToken, user }
    Backend-->>Security: 200 OK
    Security-->>Frontend: Response
    Frontend-->>User: Success + Store JWT
```

### Component Diagram with Database Indexes

```mermaid
graph TD
    subgraph Frontend["Frontend (Next.js 16)"]
        NP[Notes Page]
        ND[Note Detail]
        CF[Create/Edit Form]
    end

    subgraph Security["Security Layer"]
        HELMET[Helmet Headers]
        RATE[Rate Limiter]
    end

    subgraph Backend["Backend (NestJS)"]
        NC[Notes Controller]
        JWT[JWT Guard]
        VP[Validation Pipes]
        SANITIZE[Input Sanitization]
        NS[Notes Service]
    end

    subgraph MongoDB["MongoDB Layer"]
        COL[Notes Collection]
        TIDX[Text Index<br/>title, content]
        CIDX[Compound Index<br/>userId+isPublic+createdAt]
        TAGIDX[Tag Index<br/>tags+isPublic+createdAt]
        SPIDX[Sparse Index<br/>views>100]
        UIDX[User Index<br/>username unique]
        PL[Stats Aggregation]
    end

    NP --> HELMET
    ND --> HELMET
    CF --> HELMET
    HELMET --> RATE
    RATE --> NC
    NC --> JWT
    NC --> VP
    VP --> SANITIZE
    SANITIZE --> NS
    NS --> COL
    NS --> TIDX
    NS --> CIDX
    NS --> TAGIDX
    NS --> SPIDX
    NS --> UIDX
    NS --> PL
```

---

## Technology Stack

| Component      | Technology                           |
| -------------- | ------------------------------------ |
| Frontend       | Next.js 16, React 19, TanStack Query |
| Backend        | NestJS 11                            |
| Security       | Helmet, Express-Rate-Limit           |
| Database       | MongoDB                              |
| ODM            | Mongoose 9                           |
| Authentication | Passport JWT, bcrypt                 |

---

## API Endpoints

| Method | Endpoint                          | Description             |
| ------ | --------------------------------- | ----------------------- |
| GET    | /api/notes                        | List notes (paginated)  |
| GET    | /api/notes?sort=...&algorithm=... | Sort & filter notes     |
| GET    | /api/notes/:id                    | Get note (+ view count) |
| POST   | /api/notes                        | Create note             |
| PUT    | /api/notes/:id                    | Update note             |
| DELETE | /api/notes/:id                    | Delete note             |
| POST   | /api/notes/:id/comments           | Add comment             |
| GET    | /api/notes/stats                  | Get statistics          |
| GET    | /api/notes/activity               | Get activity feed       |
| GET    | /api/sort/algorithms              | Get sort algorithms     |
| POST   | /api/seed/notes/:count            | Seed random notes       |
| POST   | /api/seed/clear                   | Clear all notes         |
| GET    | /api/seed/count                   | Get note count          |

---

## Sorting Algorithms

| Algorithm   | Time           | Space    | Stable | Description                |
| ----------- | -------------- | -------- | ------ | -------------------------- |
| Merge Sort  | O(n log n)     | O(n)     | Yes    | Divide and conquer, stable |
| Quick Sort  | O(n log n) avg | O(log n) | No     | Fast average case          |
| Bubble Sort | O(n²)          | O(1)     | Yes    | Simple, educational        |
| MongoDB     | O(log n)       | O(1)     | Yes    | Database native            |

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
