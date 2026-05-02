# Testing Documentation

## Overview

This document describes the testing strategy for the NoSQL Notes Application, covering unit tests, integration tests, and testing best practices specific to NoSQL database interactions.

---

## Test Structure

```
apps/backend/
├── src/
│   ├── utils/
│   │   └── sort-algorithms.spec.ts    # Sorting algorithm unit tests
│   ├── notes/
│   │   ├── dto/
│   │   │   └── create-note.dto.spec.ts # DTO validation tests
│   │   ├── pipes/
│   │   │   └── normalize-tags.pipe.spec.ts # Pipe transformation tests
│   │   └── validators/
│   │       └── is-tag.validator.spec.ts  # Custom validator tests
│   └── app.controller.spec.ts         # Controller unit tests
```

---

## Running Tests

### Unit Tests
```bash
cd apps/backend
npm test                 # Run all tests once
npm run test:watch       # Run tests in watch mode
npm run test:cov         # Run tests with coverage report
```

### E2E Tests
```bash
npm run test:e2e         # Run end-to-end tests (requires database)
```

---

## Sorting Algorithm Tests

Located in: `src/utils/sort-algorithms.spec.ts`

### Coverage

| Algorithm | Tests | Edge Cases |
|-----------|-------|------------|
| MergeSort | 9 tests | Empty, single, stable, large dataset |
| QuickSort | 8 tests | Empty, single, duplicates, reverse sorted |
| BubbleSort | 7 tests | Empty, single, stable, early exit |

### Test Scenarios

#### 1. Basic Sorting
```typescript
it('should sort by title ascending', () => {
  const result = sorter.sort([...unsortedNotes], compareByTitleAsc);
  expect(result.map(n => n.title)).toEqual(['A Note', 'B Note', 'C Note']);
});
```

#### 2. Edge Cases
- **Empty Array**: All algorithms return empty array
- **Single Element**: Returns same element
- **Two Elements**: Correct ordering verified

#### 3. Algorithm Properties
- **Stability Test** (MergeSort, BubbleSort): Equal elements maintain relative order
- **Large Dataset Performance**: 1000 elements sorted in < 1 second
- **No Mutation**: Original array remains unchanged

#### 4. Comparison Tests
All three algorithms produce identical sorted results for same input.

---

## DTO Validation Tests

### CreateNoteDto
- Title validation (required, max 200 chars)
- Content validation (required, max 50000 chars)
- Tags validation (max 10 tags, alphanumeric only)
- Input sanitization (XSS prevention)

### CreateCommentDto
- Content validation (required, max 1000 chars)
- XSS pattern detection

---

## NoSQL-Specific Testing Considerations

### 1. Database Connection Testing
```typescript
// Test sanitized URI doesn't break connection
it('should connect with actual URI while logging sanitized', async () => {
  const module = await Test.createTestingModule({
    imports: [DatabaseModule.forRoot()],
  }).compile();
  expect(module).toBeDefined();
});
```

### 2. Index Verification
```typescript
// Verify indexes are created
it('should have compound index for userId+isPublic+createdAt', async () => {
  const indexes = await notesCollection.getIndexes();
  expect(indexes).toContainEqual(
    expect.objectContaining({
      key: { userId: 1, isPublic: 1, createdAt: -1 }
    })
  );
});
```

### 3. Atomic Operation Testing
```typescript
// Test concurrent view increments don't lose data
it('should handle concurrent view increments atomically', async () => {
  const noteId = '...';
  const increments = Array(10).fill(null).map(() =>
    service.incrementViews(noteId)
  );
  await Promise.all(increments);
  const note = await service.findOne(noteId);
  expect(note.views).toBe(10); // All increments applied
});
```

### 4. Schema Validation Testing
```typescript
// Test schema-level constraints
it('should reject comments with script tags', async () => {
  const maliciousComment = '<script>alert("xss")</script>';
  await expect(
    service.addComment(noteId, { content: maliciousComment }, user)
  ).rejects.toThrow();
});
```

---

## Performance Testing

### Sorting Algorithm Benchmarks

| Algorithm | 100 items | 1,000 items | 10,000 items |
|-----------|-----------|-------------|--------------|
| MergeSort | < 10ms | < 50ms | < 500ms |
| QuickSort | < 10ms | < 50ms | < 500ms |
| BubbleSort | < 10ms | ~100ms | > 5s (avoid) |
| MongoDB Native | < 5ms | < 10ms | < 50ms |

### Database Query Performance

| Query Type | With Index | Without Index |
|------------|------------|---------------|
| Find by userId | ~5ms | ~500ms+ |
| Tag search | ~10ms | ~1000ms+ |
| Text search | ~20ms | N/A (requires index) |
| Sort by createdAt | ~5ms | ~200ms+ |

---

## Security Testing

### Authentication Tests
- Valid JWT token allows access
- Expired token rejected
- Invalid signature rejected
- Missing token on protected routes returns 401

### Authorization Tests
- Owner can modify own notes
- Non-owner cannot modify others' notes
- Public notes readable by all
- Private notes only readable by owner

### Input Validation Tests
- XSS payload rejected in title/content
- SQL/NoSQL injection attempts sanitized
- Oversized input rejected
- Malformed JSON handled gracefully

### Rate Limiting Tests
- 101st request within window returns 429
- Rate limit headers present (RateLimit-Remaining, etc.)
- Auth endpoints have stricter limits
- Successful logins don't count against auth limit

---

## Testing Best Practices

### 1. Test Isolation
- Use separate test database (`notes-test`)
- Clean up after each test
- Mock external services

### 2. Test Data Factory
```typescript
const createTestNote = (overrides = {}) => ({
  title: 'Test Note',
  content: 'Test content',
  userId: new Types.ObjectId(),
  ...overrides
});
```

### 3. Assertion Patterns
```typescript
// Use specific assertions
expect(result.title).toBe('Expected Title');

// Test error cases
await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);

// Test partial updates
expect(result.tags).toContain('new-tag');
expect(result.views).toBeGreaterThan(0);
```

### 4. Async Testing
```typescript
// Always await async operations
it('should create note', async () => {
  const result = await service.create(dto, user);
  expect(result).toBeDefined();
});
```

---

## Continuous Integration

### Pre-commit Checks
```yaml
# .github/workflows/test.yml
- name: Run Unit Tests
  run: |
    cd apps/backend
    npm ci
    npm test

- name: Run Lint
  run: |
    cd apps/backend
    npm run lint
```

### Coverage Requirements
- Minimum 80% code coverage
- 100% coverage for critical paths (auth, security)

---

## Debugging Tests

### Failed Test Investigation
1. Check test isolation (data pollution)
2. Verify database state
3. Review recent schema changes
4. Check for race conditions in async tests

### Common Issues
| Issue | Solution |
|-------|----------|
| MongoDB connection timeout | Increase timeout, check connection string |
| Flaky async tests | Add proper await, check for race conditions |
| Index not found | Ensure indexes are created before tests |
| Schema validation errors | Check default values and required fields |

---

## Future Test Enhancements

1. **Load Testing**: Artillery or k6 for concurrent user simulation
2. **Property-Based Testing**: fast-check for generative testing
3. **Contract Testing**: Pact for API contract verification
4. **Mutation Testing**: Stryker to test test quality
