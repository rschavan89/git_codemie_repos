# git_codemie_repos

This repository contains a full-stack sample application for EPMCDMETST-59907.

## Tech Stack

### Backend
- Java + Spring Boot
- Spring Data JPA
- Bean Validation (Jakarta Validation)
- H2 (in-memory database)

### Frontend
- React
- Vite

### Testing
- Backend API tests: RestAssured
- UI tests (E2E): Playwright

---

## Prerequisites

- Java 17+ (or your project’s configured Java version)
- Maven 3.8+
- Node.js 18+ (recommended)
- npm 9+

---

## Project Structure

- `backend/` — Spring Boot application (API + persistence)
- `frontend/` — React (Vite) client
- `playwright/` or `frontend/` (depending on setup) — Playwright UI tests (run via npm script)

---

## Backend (Spring Boot)

### Install / Build
From the repository root:
- If backend is in `backend/`:
  - `cd backend`
- Otherwise, run from the module where `pom.xml` is located.

### Run Tests
mvn test

### Run the Application
mvn spring-boot:run

The backend will start on the configured port (commonly `http://localhost:8080`).

### Notes
- The application uses H2 for local development/testing.
- Persistence uses Spring Data JPA.
- Request validation is handled via Jakarta Bean Validation annotations.

---

## Frontend (React + Vite)

### Install Dependencies
From the repository root:
- If frontend is in `frontend/`:
  - `cd frontend`

npm i

### Run in Development Mode
npm run dev

Vite will start the dev server and print the local URL (commonly `http://localhost:5173`).

---

## Playwright UI Tests

### Install Dependencies
From the frontend directory (or wherever `package.json` defines UI test scripts):
npm i

### Run UI Tests
npm run test:ui

### Notes / Expectations
- Ensure backend and frontend are running (unless your scripts start them automatically).
- Playwright will run end-to-end UI tests against the running app.
- If needed, adjust base URLs in Playwright config to match your local ports.

---

## Typical Local Workflow

1. Start backend:
   - `cd backend`
   - `mvn spring-boot:run`

2. Start frontend:
   - `cd frontend`
   - `npm i`
   - `npm run dev`

3. Run backend tests:
   - `cd backend`
   - `mvn test`

4. Run Playwright UI tests:
   - `cd frontend`
   - `npm run test:ui`

---

## Testing Summary

- **Backend unit/integration tests**: `mvn test` (includes API tests via RestAssured where configured)
- **Frontend dev server**: `npm run dev`
- **UI E2E tests**: `npm run test:ui`