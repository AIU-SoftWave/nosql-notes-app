# Project Proposal: NoSQL-Powered Knowledge Management System

## 1. Project Idea & Target Audience

The **NoSQL Notes App** is a specialized web application built to explore the advantages of non-relational data modeling. It targets users with high-variability data needs—such as researchers and developers—who require a flexible environment for semi-structured information.

## 2. NoSQL vs. SQL: The Rationale

The core of this project is demonstrating why NoSQL (specifically MongoDB) is superior for modern, content-heavy web applications compared to traditional Relational Database Management Systems (RDBMS).

### A. Paradigm Shift: Tabular vs. Document

In an RDBMS, data is forced into rows and columns, requiring "Junction Tables" for tags and "Foreign Keys" for comments. In our NoSQL approach, we use **Data Aggregation**: a Note is a single, self-contained document.

| Feature           | Relational (SQL)              | Document-Oriented (NoSQL)    | Project Benefit                        |
| :---------------- | :---------------------------- | :--------------------------- | :------------------------------------- |
| **Schema**        | Rigid, predefined columns.    | Dynamic, BSON-based schemas. | Notes can evolve without migrations.   |
| **Relationships** | Joins across multiple tables. | Embedded sub-documents.      | O(1) retrieval of notes with comments. |
| **Scaling**       | Vertical (bigger servers).    | Horizontal (sharding).       | Ready for massive data volumes.        |
| **Complexity**    | High (Normalized).            | Low (Data maps to Objects).  | Backend logic matches UI components.   |

### C. Future-Proofing for Scale

While the current implementation is a single-node setup, selecting MongoDB ensures the application is "Scale-Ready." Unlike RDBMS, which requires complex sharding logic at the application level, MongoDB provides:

- **Native Sharding:** Horizontal scaling across multiple clusters without re-writing queries.
- **High Availability:** Built-in replica sets for automatic failover.
- **Elasticity:** The ability to handle millions of notes and concurrent users with sub-millisecond latency.

## 3. Detailed Technical Architecture

The application leverages a three-tier architecture optimized for asynchronous data flow and containerized deployment.

### Tier 1: Presentation (Next.js)

- **State Management:** TanStack Query for server-state synchronization.
- **Rendering:** Client-side rendering with Suspense boundaries to handle URL-based search state.
- **Interactivity:** Markdown editor integration for rich-text handling.

### Tier 2: Application (NestJS)

- **Engine:** Node.js with TypeScript for type-safe data handling.
- **Abstraction:** Mongoose ODM (Object Document Mapper) to interface with the NoSQL engine.
- **Validation:** Global Pipes using `class-validator` to ensure document integrity before persistence.

### Tier 3: Data (MongoDB)

- **Model:** Document-based storage.
- **Indexing:** Multikey indexes on `tags`, text indexes on `title`/`content` for high-performance searching.
- **Aggregation:** MongoDB Aggregation Pipeline for computing statistics server-side.
- **Concurrency:** Optimistic locking via version keys (`__v`).

## 4. Implementation Objectives Met

1. **Fundamental Concepts:** Clear implementation of the difference between tabular and document models.
2. **Data Modeling:** Transition from 3rd Normal Form (3NF) to an aggregated document model.
3. **Challenges Addressed:**
   - **Data Consistency:** Managed via Schema-level validation in Mongoose.
   - **Scalability:** Optimized query paths via indexing.
   - **Security:** Sanitized input to prevent NoSQL injection.
