# Contributing Guidelines

## Purpose

This document defines how team members should work on the project to ensure consistency, code quality, and smooth collaboration.

All team members must follow these guidelines.

---

## Branching Strategy

We use the following branches:

* `main`: stable, production-ready code only
* `dev`: integration branch for all features
* `feature/*`: individual features

### Naming Convention

* feature/notes-api
* feature/comments-system
* feature/frontend-ui
* bug/fix-note-delete

---

## Development Workflow

1. Pull latest changes from `dev`

   ```
   git checkout dev
   git pull origin dev
   ```

2. Create a new feature branch

   ```
   git checkout -b feature/<feature-name>
   ```

3. Implement your changes

4. Commit your work

   ```
   git commit -m "Clear and descriptive message"
   ```

5. Push your branch

   ```
   git push origin feature/<feature-name>
   ```

6. Open a Pull Request to `dev`

---

## Commit Guidelines

* Use clear and meaningful commit messages
* Examples:

  * "Add create note API"
  * "Implement comment feature"
  * "Fix bug in note deletion"

Avoid vague messages like:

* "update"
* "fix"
* "done"

---

## Pull Request Rules

Before submitting a PR:

* Ensure your code works correctly
* Test your feature locally
* Make sure it does not break existing functionality

### PR Requirements

* One feature per PR
* Must be reviewed before merging
* Must follow project structure

---

## Code Style

* Keep code simple and readable
* Use consistent naming conventions
* Avoid unnecessary complexity
* Comment important logic when needed

---

## Task Management

* All work must be tracked using GitHub Issues
* Each feature or task should have an issue
* Assign yourself to the issue before starting

---

## Definition of Done

A task is considered complete only when:

* Feature is fully implemented
* Code is tested
* Pull request is reviewed
* Changes are merged into `dev`

---

## Communication

* Share progress regularly
* Report blockers early
* Ask questions when unsure

---

## Responsibilities

Each team member is responsible for:

* Writing clean code
* Following the workflow
* Completing assigned tasks on time
* Helping maintain overall project quality

---

## Final Note

Consistency is more important than speed. Following these guidelines ensures the project remains organized and maintainable.
