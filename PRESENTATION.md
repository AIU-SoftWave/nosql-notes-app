# Presentation Outline: NoSQL-Powered Knowledge Management System

## Slide 1: Title Slide

- **Title:** Beyond the Table: NoSQL Web Applications
- **Sub-title:** Implementing a Scalable Document-Oriented Notes System
- **Team Members:** [Name 1, Name 2, Name 3]
- **Course:** CSE323 Advanced Database Systems

## Slide 2: The Project Mission

- **Objective:** Move away from rigid relational schemas to flexible document-oriented storage.
- **Core Technology:** MongoDB (NoSQL) as the authoritative data store.
- **Goal:** Demonstrate real-world performance and scalability benefits of NoSQL.

## Slide 3: SQL vs. NoSQL: Why We Switched

- **Relational Constraints:** Fixed columns, complex migrations, and expensive JOINs for simple notes.
- **NoSQL Freedom:**
  - **Dynamic Schema:** Every note can have different fields (e.g., varying tag counts).
  - **Data Locality:** Storing comments as embedded sub-documents (One seek vs. multiple JOINs).
  - **Developer Velocity:** Data in MongoDB looks exactly like our JSON/TypeScript objects.

## Slide 4: Data Modeling Deep Dive

- _Visual:_ Include `diagrams/png/data_model.png`
- **Normalization vs. Aggregation:** Explain the shift from 3NF (SQL) to Aggregated Documents (NoSQL).
- **Embedded Comments:** Why O(1) retrieval beats O(log n) JOINs.
- **Atomic Updates:** How we use MongoDB's array operators (`$push`, `$pull`) for tags.

## Slide 5: Architectural Overview (Full Stack)

- _Visual:_ Include `diagrams/png/architecture.png` and `diagrams/png/deployment.png`
- **Frontend:** Next.js with React Suspense for optimized Client-Side Rendering (CSR).
- **Backend:** NestJS (Node.js) providing a unified API layer.
- **Database:** MongoDB (The NoSQL Core).
- **Orchestration:** Docker Compose for reproducible environments.

## Slide 6: Data Flow: From UI to Document

- _Visual:_ Include `diagrams/png/data_flow.png`
- **Frontend Validation:** Ensuring data integrity before the request.
- **BSON Transformation:** How JSON from the client becomes a BSON document in MongoDB.
- **Schema-less Persistence:** Handling the Tags array without a relational schema.

## Slide 7: Overcoming NoSQL Challenges

- **Data Consistency:** How we use Mongoose Schemas to enforce application-level validation.
- **Concurrency:** Utilizing MongoDB's `__v` version key for optimistic locking.
- **Search Performance:** Implementation of Multikey and Compound Indexes to prevent full-collection scans.

## Slide 8: Technical Implementation (CRUD)

- **Create:** Validating dynamic BSON documents.
- **Read:** Combining Tag Filtering with Regex-based text search.
- **Update/Delete:** Maintaining referential integrity without foreign key constraints.

## Slide 9: From Simple App to Massive Scale

- **Our App:** Currently a single-node document store for simplicity.
- **Enterprise Reality:** Companies like Netflix and LinkedIn use NoSQL for:
  - **Horizontal Sharding:** Distributing data across thousands of nodes without application changes.
  - **Low Latency:** High-velocity writes (autosaves) don't lock the whole table like SQL.
  - **Global Distribution:** Native replication across different geographic regions.
- **Key Takeaway:** By choosing NoSQL today, our architecture is "Future-Proof" for millions of users.

## Slide 10: Conclusion & Future Work

- **Lessons Learned:** NoSQL is about "Query-First" modeling.
- **Future:** Implementing horizontal sharding for massive scale.
- **Questions?**

---

### Recommended Presentation Tools:

1. **Marp for VS Code:** (Highly recommended) Converts Markdown directly into high-quality PDF/HTML slides.
2. **Google Slides / PowerPoint:** Export PNGs from the `./diagrams/png` folder and insert them.
