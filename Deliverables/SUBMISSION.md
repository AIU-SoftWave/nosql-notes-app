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
  "comments": [{ "content": "Great summary!", "createdAt": "ISO-Date" }],
  "views": 42,
  "createdAt": "ISO-Date",
  "updatedAt": "ISO-Date"
}
```

## 5. CRUD Implementation

The application implements all core CRUD operations via the NestJS Mongoose module:

- **Create:** `POST /api/notes` - Stores a new document with dynamic tags.
- **Read:** `GET /api/notes` - Supports complex filtering using regex for search and array-matching for tags.
- **Read with Sort:** `GET /api/notes?sort=newest|oldest|alpha` - Sort notes by creation date or title.
- **Read Single:** `GET /api/notes/:id` - Retrieves a note (increments view count atomically).
- **Update:** `PATCH /api/notes/:id` - Updates specific fields without overwriting the entire document.
- **Delete:** `DELETE /api/notes/:id` - Removes the document and its sub-resources.
- **Comments:** `POST /api/notes/:id/comments` - Adds comments to a note.
- **Statistics:** `GET /api/notes/stats` - Returns total notes, comments, views, and top tags using MongoDB Aggregation Pipeline.
- **Activity Feed:** `GET /api/notes/activity?limit=10` - Returns recent notes and comments for real-time activity tracking.

## 6. Challenges & Solutions

- **Data Consistency:** Used Mongoose Schemas to enforce validation at the application level while maintaining NoSQL flexibility.
- **Concurrency:** Leveraged MongoDB's optimistic concurrency control (version keys).
- **Scalability:** Implemented indexed search on `title` and `content` to optimize query performance as the dataset grows.
- **View Tracking:** Implemented atomic view counting using MongoDB's `$inc` operator - impossible in SQL without row locking.
- **Analytics:** Used MongoDB Aggregation Pipeline to compute statistics server-side, reducing application-side processing.

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

### Defense in Depth Strategy

The application implements multiple security layers to protect against common web vulnerabilities:

#### 1. Security Headers (Helmet)

- **Content Security Policy (CSP):** Blocks XSS by restricting resource loading to trusted sources
- **X-Frame-Options:** Prevents clickjacking attacks by disallowing iframe embedding
- **Strict-Transport-Security:** Enforces HTTPS connections
- **X-Content-Type-Options:** Prevents MIME type sniffing attacks

#### 2. Rate Limiting

- **General API:** 100 requests per 15 minutes per IP address
- **Authentication Endpoints:** Stricter 5 attempts per 15 minutes for login/register
- **RFC-Compliant Headers:** `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` headers provided
- **Skip Successful Logins:** Successful authentication attempts don't count against the limit

#### 3. Input Validation & Sanitization

- **DTO Validation:** class-validator decorators enforce type safety and constraints
- **XSS Prevention:** `@Transform` decorators strip `<script>` tags, `javascript:` protocols, and event handlers (`onclick`, `onload`, etc.)
- **Max Length Constraints:**
  - Title: 200 characters
  - Content: 50,000 characters
  - Comments: 1,000 characters
  - Tags: 10 maximum per note
- **Schema Validation:** Mongoose schemas include regex patterns to reject malicious input at the database level

#### 4. Authentication Security

- **Password Hashing:** bcrypt with 10 salt rounds
- **JWT Security:** 7-day token expiration with secure payload signing
- **No Sensitive Data in JWT:** Tokens only contain user ID and username (no passwords)

#### 5. Database Security

- **NoSQL Injection Prevention:** Mongoose parameterized queries prevent injection attacks
- **Credential Masking:** Database URIs sanitized in logs (passwords replaced with \*\*\*\*)
- **Environment Isolation:** Database credentials managed via `.env` files, never hardcoded

#### 6. CORS Configuration

- Whitelist-based origin validation via environment variables
- Credentials-enabled for authenticated requests
- Restricted HTTP methods (GET, POST, PUT, PATCH, DELETE, HEAD)

## 9. Efficiency Analysis

- **Time Complexity:**
  - Note Retrieval: O(1) with ID lookup.
  - Tag Search: O(n) scan optimized to O(log n) via multikey indexing on the `tags` array.
- **Storage:** Reduced storage overhead by avoiding relational overhead and redundant foreign keys.
