# System Architecture

## Overview

The application follows a three-tier architecture:

1. Frontend (Client)
2. Backend (Server/API)
3. Database (MongoDB)

---

## Architecture Diagram (Logical)

Frontend → Backend API → MongoDB

---

## Components

### Frontend

* Built using React
* Handles user interface and user interactions
* Communicates with backend via HTTP requests

### Backend

* Built using Node.js and Express
* Handles business logic
* Provides RESTful APIs
* Interacts with MongoDB

### Database

* MongoDB (NoSQL document database)
* Stores notes, comments, and metadata

---

## Data Flow

1. User performs action on frontend
2. Request sent to backend API
3. Backend processes request
4. Data stored/retrieved from MongoDB
5. Response returned to frontend

---

## Design Decisions

* Use of NoSQL for flexible schema
* Embedding comments within notes to reduce joins
* REST API for clear separation of concerns
