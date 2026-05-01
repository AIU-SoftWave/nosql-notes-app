# API Design

## Base URL

```
/api/notes
```

---

## Stack & Standards

- Backend: NestJS (Node.js framework)
- Follows RESTful conventions
- All responses use JSON: `{ success, data, message }`
- Error responses use appropriate HTTP status codes and descriptive messages

---

## Endpoints

### 1. Create Note

POST /api/notes

Body:

```json
{
  "title": "string",
  "content": "string",
  "tags": ["string"]
}
```

---

### 2. Get All Notes (with Pagination & Sorting)

GET /api/notes

Query Parameters:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| tag | string | - | Filter by tag (case-insensitive) |
| search | string | - | Search in title/content (min 2 chars) |
| sort | string | newest | Sort: `newest`, `oldest`, `alpha`, `views`, `comments` |
| algorithm | string | merge | Sort algorithm: `merge`, `quick`, `bubble`, `mongo` |
| page | number | 1 | Page number |
| limit | number | 10 | Items per page (max 100) |

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  },
  "performance": {
    "algorithmId": "merge",
    "algorithmName": "Merge Sort",
    "executionTimeMs": 12.5,
    "dataSize": 100,
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(n)",
    "stable": true
  }
}
```

---

### 3. Get Note by ID

GET /api/notes/:id

**Automatic View Tracking:** This endpoint automatically increments the view count using MongoDB's atomic `$inc` operator.

---

### 4. Update Note

PUT /api/notes/:id

---

### 5. Delete Note

DELETE /api/notes/:id

---

### 6. Add Comment

POST /api/notes/:id/comments

Body:

```json
{
  "content": "string"
}
```

---

### 7. Get Statistics

GET /api/notes/stats

Returns aggregated statistics using MongoDB Aggregation Pipeline.

Response:
```json
{
  "totalNotes": 42,
  "totalComments": 128,
  "totalViews": 1024,
  "tags": [
    { "tag": "work", "count": 15 },
    { "tag": "research", "count": 10 }
  ]
}
```

---

### 8. Get Activity Feed

GET /api/notes/activity?limit=10

Returns recent notes and comments sorted by creation date.

Response:
```json
[
  { "type": "note", "noteId": "...", "title": "...", "createdAt": "..." },
  { "type": "comment", "noteId": "...", "title": "...", "createdAt": "..." }
]
```

---

### 9. Get Sort Algorithms

GET /api/sort/algorithms

Returns all available sorting algorithms with their metrics.

Response:
```json
{
  "success": true,
  "data": {
    "algorithms": [
      {
        "id": "merge",
        "name": "Merge Sort",
        "metrics": {
          "algorithmId": "merge",
          "name": "Merge Sort",
          "description": "Efficient, stable divide-and-conquer...",
          "timeComplexity": { "best": "O(n log n)", "average": "O(n log n)", "worst": "O(n log n)" },
          "spaceComplexity": "O(n)",
          "stable": true,
          "category": "divide-conquer"
        }
      },
      ...
    ]
  }
}
```

---

### 10. Seed Database

POST /api/seed/notes/:count

Seed the database with random notes (max 10000).

Response:
```json
{
  "success": true,
  "count": 100,
  "message": "Successfully seeded 100 notes"
}
```

---

### 11. Clear Database

POST /api/seed/clear

Delete all notes from the database.

Response:
```json
{
  "success": true,
  "count": 50
}
```

---

### 12. Get Note Count

GET /api/seed/count

Returns the total number of notes.

Response:
```json
{
  "success": true,
  "count": 100
}
```

---

## Sorting Algorithms

| Algorithm | Time Complexity | Space Complexity | Stable |
|-----------|----------------|-----------------|--------|
| Merge Sort | O(n log n) | O(n) | Yes |
| Quick Sort | O(n log n) avg | O(log n) | No |
| Bubble Sort | O(n²) | O(1) | Yes |
| MongoDB Native | O(log n) | O(1) | Yes |

---

## Response Format

```json
{
  "success": true,
  "data": {},
  "message": "optional message"
}
```

---

## Error Handling

- All errors return a JSON object with `success: false`, a `message`, and (optionally) an `error` field.
- Example:

```json
{
  "success": false,
  "message": "Note not found",
  "error": "NotFoundException"
}
```

---

## Notes
- All endpoints are stateless and require no authentication (for demo version).
- View counting is automatic via atomic `$inc` - no race conditions.
- Statistics computed server-side via MongoDB Aggregation Pipeline.
- Seed endpoint generates random notes with realistic content for testing.
- Extend with authentication and authorization as needed for production.