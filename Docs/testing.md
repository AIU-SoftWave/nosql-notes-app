# Testing Strategy

## Objectives

* Ensure all features work correctly
* Validate API responses
* Detect bugs early

---

## Testing Types

### Functional Testing

* Test CRUD operations
* Test comment system
* Test tagging

### API Testing

* Use Postman or similar tools
* Validate request/response format
* Test RESTful endpoints provided by NestJS backend

### Edge Cases

* Empty inputs
* Large number of comments
* Invalid IDs

---

## Manual Testing

* Verify UI behavior in Next.js frontend
* Check data consistency in MongoDB

---

## Automated Testing (Recommended)

* Add unit tests for backend (NestJS, e.g., using Jest)
* Add integration tests for API endpoints
* Add frontend tests (Next.js, e.g., using React Testing Library)

---

## Future Improvements

* Increase test coverage for backend and frontend
* Add CI/CD integration for automated test runs
