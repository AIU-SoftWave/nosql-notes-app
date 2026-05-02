# Database Design (MongoDB)

## Overview

The system uses MongoDB as a document-based NoSQL database, integrated with a NestJS backend and accessed via RESTful APIs from a Next.js frontend.

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

- Avoid joins
- Improve read performance
- Keep related data together

### Tags as Arrays

Tags are stored as arrays to:

- Allow flexible categorization
- Enable easy searching and filtering

### Activity Tracking

Views and timestamps are stored within the document for quick access.

---

## Advantages of NoSQL

- Flexible schema
- Faster reads (no joins)
- Easy to scale horizontally

---

## Trade-offs

- Data duplication risk
- Larger document size
- Harder updates for deeply nested data

---

## Data Consistency & Concurrency Control

### 1. Optimistic Locking with Version Key

MongoDB's `__v` version key is used for optimistic locking to prevent lost updates:

```typescript
// Mongoose automatically adds __v field
const updated = await this.notesModel.findByIdAndUpdate(id, updateData, {
  new: true,
});
// If __v has changed since read, update fails
```

### 2. Atomic Operations

MongoDB provides atomic operators for concurrent-safe updates:

**View Counter Increment (Atomic)**

```typescript
await this.notesModel.findByIdAndUpdate(id, { $inc: { views: 1 } });
```

**Comment Addition (Atomic Array Push)**

```typescript
await this.notesModel.findByIdAndUpdate(id, {
  $push: { comments: newComment },
});
```

**Partial Updates (Atomic Field Updates)**

```typescript
await this.notesModel.findByIdAndUpdate(id, {
  $set: { title: "New Title" },
  $addToSet: { tags: "new-tag" }, // Only adds if not exists
});
```

### 3. Handling Lack of ACID Transactions

Since MongoDB documents are the atomic unit, we design for single-document consistency:

**Embedded vs Referenced Data:**

- Comments are **embedded** in notes (single document atomicity)
- Users are **referenced** from notes (eventual consistency acceptable)

**Compensating Patterns:**

```typescript
// Update note and increment user stats in separate operations
// If one fails, application handles partial failure
await Promise.all([
  notesModel.findByIdAndUpdate(noteId, updateData),
  userStatsModel.updateOne({ userId }, { $inc: { noteCount: 1 } }),
]);
```

### 4. Read Consistency

**Default Read Preference:** Primary (strong consistency)

- All reads go to primary replica for latest data
- Acceptable for single-node deployment

**For Future Scaling:**

```javascript
// Can be configured for read preferences
{
  readPreference: "secondaryPreferred";
} // Eventual consistency reads
```

### 5. Write Concerns

Default write concern ensures durability:

```javascript
{ w: 1, j: true }  // Acknowledged write, journal committed
```

### 6. Data Validation at Application Level

Mongoose schemas enforce structure despite MongoDB's schemaless nature:

```typescript
@Prop({ required: true, minlength: 1, maxlength: 1000 })
content!: string;
```

---

## Indexing Strategy

### Single Field Indexes

```javascript
// User collection
{
  username: 1;
} // unique index for fast lookup

// Note collection
{
  createdAt: -1;
} // For newest/oldest sorting
{
  userId: 1;
} // For user-specific queries
{
  isPublic: 1;
} // For public note filtering
```

### Compound Indexes

```javascript
// Most common query: user's public/private notes sorted by date
{ userId: 1, isPublic: 1, createdAt: -1 }

// Tag search with visibility filter
{ tags: 1, isPublic: 1, createdAt: -1 }

// Text search
{ title: 'text', content: 'text' }
```

### Sparse/Partial Indexes

```javascript
// Only index popular notes (views > 100) for leaderboard queries
{ views: -1 }, { partialFilterExpression: { views: { $gt: 100 } } }
```
