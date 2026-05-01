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

### 2. Get All Notes

GET /api/notes

Query Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| tag | string | Filter by tag (case-insensitive) |
| search | string | Search in title/content (min 2 chars) |
| sort | string | Sort: `newest` (default), `oldest`, `alpha` |

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
- Extend with authentication and authorization as needed for production.