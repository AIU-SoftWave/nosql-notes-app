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

---

### 3. Get Note by ID

GET /api/notes/:id

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
  "user": "string",
  "text": "string"
}
```

---

### 7. Increment Views

PATCH /api/notes/:id/view

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
- Extend with authentication and authorization as needed for production.
