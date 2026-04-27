# Database Design (MongoDB)

## Overview

The system uses MongoDB as a document-based NoSQL database.

---

## Collections

### Notes Collection

Example document:

```json
{
  "_id": "ObjectId",
  "title": "Dynamic Programming",
  "content": "Explanation of DP...",
  "tags": ["algorithms", "dp"],
  "comments": [
    {
      "user": "Ahmad",
      "text": "Great note",
      "date": "2026-04-27"
    }
  ],
  "views": 10,
  "createdAt": "2026-04-27",
  "updatedAt": "2026-04-27"
}
```

---

## Design Choices

### Embedding Comments

Comments are embedded inside notes to:

* Avoid joins
* Improve read performance
* Keep related data together

### Tags as Arrays

Tags are stored as arrays to:

* Allow flexible categorization
* Enable easy searching and filtering

### Activity Tracking

Views and timestamps are stored within the document for quick access.

---

## Advantages of NoSQL

* Flexible schema
* Faster reads (no joins)
* Easy to scale horizontally

---

## Trade-offs

* Data duplication risk
* Larger document size
* Harder updates for deeply nested data
