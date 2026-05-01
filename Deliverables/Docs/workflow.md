# Development Workflow

## Branching Strategy

* main: stable version
* dev: integration branch
* feature branches: individual tasks

Example:

* feature/backend-api
* feature/frontend-ui
* feature/nestjs-migration
* feature/nextjs-ui

---

## Workflow Steps

1. Pull latest dev branch
2. Create feature branch
3. Implement feature (NestJS backend, Next.js frontend, MongoDB)
4. Commit changes
5. Push branch
6. Open Pull Request to dev
7. Code review and merge

---

## Commit Guidelines

* Use clear, descriptive messages
* Example:

  * "Add create note API (NestJS)"
  * "Implement comment UI (Next.js)"

---

## Pull Request Rules

* One feature per PR
* Must be reviewed before merging
* Must not break existing functionality

---

## Task Management

Tasks are managed using GitHub Issues:

* Each feature = one issue
* Assign to team member
* Track progress

---

## Communication

* Daily updates between team members
* Report blockers early
