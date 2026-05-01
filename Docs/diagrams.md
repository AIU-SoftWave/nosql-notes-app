# NoSQL Notes Application - Architecture Diagram

## System Architecture

```mermaid
graph TD
    subgraph Client
        Browser[Web Browser]
        NextJS[Next.js]
        TanStack[TanStack Query]
    end

    subgraph Backend
        Controller[Notes Controller]
        Service[Notes Service]
        Mongoose[Mongoose ODM]
    end

    subgraph Database
        MongoDB[MongoDB]
        Collection[Notes Collection]
        Index[Indexes]
    end

    Browser --> NextJS
    NextJS --> Controller
    Controller --> Service
    Service --> Mongoose
    Mongoose --> MongoDB
    MongoDB --> Collection
    Collection --> Index
```

---

## Complete Architecture with All Features

```mermaid
flowchart LR
    subgraph Frontend
        NotesPage[Notes Page]
        NoteDetail[Note Detail]
        Stats[Stats Page]
        Create[Create Note]
    end

    subgraph Backend
        API[REST API]
        CRUD[CRUD Operations]
        StatsAPI[Stats Endpoint]
        ActivityAPI[Activity Endpoint]
    end

    subgraph MongoDB
        Notes[Notes Collection]
        TextIdx[Text Index]
        TagIdx[Tag Index]
        Views[Views Counter]
    end

    NotesPage --> API
    NoteDetail --> API
    Stats --> API
    Create --> API
    
    API --> CRUD
    API --> StatsAPI
    API --> ActivityAPI
    
    CRUD --> Notes
    StatsAPI --> TagIdx
    ActivityAPI --> Notes
    
    Notes --> Views
    Views --> TextIdx
    TextIdx --> TagIdx
```

---

## Data Flow Sequence Diagram

### Create Note and View Note Operations

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant MongoDB

    Note over User,MongoDB: CREATE Note
    User->>Frontend: Fill form
    Frontend->>Backend: POST /api/notes
    Backend->>MongoDB: insertOne()
    MongoDB-->>Backend: Document with _id
    Backend-->>Frontend: 201 Created
    Frontend-->>User: Success

    Note over User,MongoDB: READ Note + View Count
    User->>Frontend: Click note
    Frontend->>Backend: GET /api/notes/:id
    Backend->>MongoDB: findOneAndUpdate with $inc
    MongoDB-->>Backend: Updated document
    Backend-->>Frontend: 200 OK
    Frontend-->>User: Display note

    Note over User,MongoDB: GET Stats
    User->>Frontend: Visit /stats
    Frontend->>Backend: GET /api/notes/stats
    Backend->>MongoDB: aggregate()
    MongoDB-->>Backend: Statistics
    Backend-->>Frontend: 200 OK
    Frontend-->>User: Dashboard
```

---

## Component Diagram

```mermaid
graph TB
    subgraph Frontend
        UI[React Components]
        Hooks[Custom Hooks]
        API[Notes API]
    end

    subgraph Backend
        Ctrl[Controllers]
        Svc[Services]
        DTO[DTOs]
    end

    subgraph Data
        ODM[Mongoose]
        Model[Note Model]
        Schema[Schema + Indexes]
    end

    subgraph DB
        Collection[notes collection]
        Index[Indexes]
    end

    UI --> Hooks
    Hooks --> API
    API --> Ctrl
    Ctrl --> Svc
    Svc --> DTO
    DTO --> ODM
    ODM --> Model
    Model --> Schema
    Schema --> Collection
    Collection --> Index
```

---

## Database Schema

```mermaid
erDiagram
    NOTE {
        objectid _id PK
        string title
        string content
        array tags
        array comments
        number views
        datetime createdAt
        datetime updatedAt
    }

    COMMENT {
        string content
        datetime createdAt
    }

    NOTE ||--o{ COMMENT : embeds
```

---

## MongoDB Operations Summary

| Operation | MongoDB Method | Description |
|-----------|-------------|------------|
| Create | insertOne | New note document |
| Read All | find | Get all notes |
| Read One | findById + $inc | Get note, increment views |
| Update | findByIdAndUpdate | Update note |
| Delete | findByIdAndDelete | Delete note |
| Comment | $push | Add comment to array |
| Stats | aggregate | Compute statistics |
| Search | Text Index | Full-text search |