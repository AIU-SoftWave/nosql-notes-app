# Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose

This document describes the requirements for the NoSQL Notes & Activity Tracker system. It serves as a guide for development and evaluation.

### 1.2 Scope

The system allows users to create and manage notes with comments, tags, and activity tracking using a NoSQL database.

---

## 2. System Overview

The system is a web-based application consisting of:

* Frontend interface for users
* Backend API for logic and data processing
* MongoDB database for storage

---

## 3. Actors

* User: interacts with the system to manage notes

---

## 4. Functional Requirements

* Users can create notes
* Users can view all notes
* Users can update and delete notes
* Users can add comments to notes
* Users can assign tags to notes
* The system tracks the number of views for each note

---

## 5. Non-Functional Requirements

* Performance: fast data retrieval using NoSQL
* Scalability: ability to handle increasing data
* Usability: simple and clean interface
* Maintainability: modular code structure

---

## 6. Data Requirements

* Notes stored as documents
* Comments embedded within notes
* Tags stored as arrays

---

## 7. Constraints

* Must use a NoSQL database (MongoDB)
* Must implement CRUD operations
* Must demonstrate NoSQL advantages

---

## 8. Assumptions

* Users do not require authentication (basic version)
* System is used for demonstration purposes

---

## 9. Technology Stack

* Backend: NestJS (Node.js framework)
* Frontend: Next.js (React framework)
* Database: MongoDB (NoSQL)

---

## 10. User Stories / Use Cases

* As a user, I can create, view, update, and delete notes.
* As a user, I can add comments to notes.
* As a user, I can assign tags to notes and filter/search by tags.
* As a user, I can see the number of views for each note.

---

## 11. Error Handling & API Standards

* All API responses must follow a consistent JSON format with `success`, `data`, and `message` fields.
* Errors must return appropriate HTTP status codes and descriptive messages.

---

## 12. Security, Reliability, and Accessibility

* Basic input validation on all endpoints.
* Secure API endpoints against common vulnerabilities (e.g., injection, XSS).
* The system should be reliable and handle unexpected errors gracefully.
* The frontend should be accessible (basic ARIA and keyboard navigation support).

---

## 13. Scalability & Deployment

* The system should be containerizable (Docker support recommended).
* Should support horizontal scaling for backend and database.
* Deployment environment: cloud or on-premises, with environment variables for configuration.
