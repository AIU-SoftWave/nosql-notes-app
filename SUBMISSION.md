# NoSQL-Powered Notes Application
**Course:** CSE323 Advanced Database Systems  
**Project Submission:** Monday, 4th May 2026  

## 1. Project Overview
This project is a modern, full-stack web application designed for efficient note management, leveraging **MongoDB** (a document-based NoSQL database) as its primary storage engine. The application demonstrates the flexibility of NoSQL schemas by allowing notes to have dynamic structures, nested comments, and varying tag counts without the rigidity of traditional RDBMS.

## 2. Objectives & Rationale
The primary rationale for choosing a NoSQL (MongoDB) database for this application includes:
- **Schema Flexibility:** Notes often contain unstructured data (Markdown content) and varying metadata (tags).
- **Hierarchical Data:** Storing comments within the note document avoids expensive JOIN operations.
- **Scalability:** Document-based storage is natively easier to shard and scale horizontally.

## 3. System Design & Architecture
The system follows a microservices-inspired architecture containerized with **Docker**:

### Components:
- **Frontend:** Next.js 16 (React) with Tailwind CSS and TanStack Query.
- **Backend:** NestJS (Node.js framework) providing a RESTful API.
- **Database:** MongoDB for document-based storage.
- **Orchestration:** Docker Compose for project management.

### Architectural Diagram:
```text
[User Browser] <---> [Next.js Frontend (Port 5002)]
                              |
                              v
                   [NestJS Backend API (Port 5001)]
                              |
                              v
                   [MongoDB Database (Port 27017)]
```

## 4. NoSQL Data Modeling
We utilize a **Document-based model**. Unlike a relational database where tags or comments would require junction tables, we store them as sub-documents or arrays within the `Note` document.

### Schema Example:
```json
{
  "_id": "ObjectId",
  "title": "Database Research",
  "content": "Exploring NoSQL advantages...",
  "tags": ["university", "research", "nosql"],
  "comments": [
    { "content": "Great summary!", "createdAt": "ISO-Date" }
  ],
  "createdAt": "ISO-Date"
}
```

## 5. CRUD Implementation
The application implements all core CRUD operations via the NestJS Mongoose module:
- **Create:** `POST /api/notes` - Stores a new document with dynamic tags.
- **Read:** `GET /api/notes` - Supports complex filtering using regex for search and array-matching for tags.
- **Update:** `PATCH /api/notes/:id` - Updates specific fields without overwriting the entire document.
- **Delete:** `DELETE /api/notes/:id` - Removes the document and its sub-resources.

## 6. Challenges & Solutions
- **Data Consistency:** Used Mongoose Schemas to enforce validation at the application level while maintaining NoSQL flexibility.
- **Concurrency:** Leveraged MongoDB's optimistic concurrency control (version keys).
- **Scalability:** Implemented indexed search on `title` and `content` to optimize query performance as the dataset grows.

## 7. Running the Project
### Prerequisites:
- Docker and Docker Desktop installed.

### Start the application:
```bash
# Navigate to the project root
cd apps
docker compose up -d --build
```
- **Frontend:** [http://localhost:5002](http://localhost:5002)
- **API Documentation (Swagger):** [http://localhost:5001/api/docs](http://localhost:5001/api/docs)

## 8. Security Considerations
- **CORS Configuration:** Restricted to trusted origins via environment variables.
- **Validation:** Strict class-validator pipes on the backend to prevent NoSQL injection and malformed data.
- **Environment Isolation:** Database credentials and API keys are managed via `.env` files and never hardcoded.

## 9. Efficiency Analysis
- **Time Complexity:** 
  - Note Retrieval: O(1) with ID lookup.
  - Tag Search: O(n) scan optimized to O(log n) via multikey indexing on the `tags` array.
- **Storage:** Reduced storage overhead by avoiding relational overhead and redundant foreign keys.
