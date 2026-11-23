# Instructor Explain Guide — Session 9: Validation Gate & Global Error Handler

## Live Demos
1. `src/utils/app-error.js` — Operational `AppError` hierarchy (`isOperational = true`).
2. `src/middlewares/error-handler.js` — Translating Prisma `P2002` (409), `P2025` (404), `P2023` (400), and hiding stack traces in `production`.
3. `src/middlewares/validate-objectid.js` — Stopping malformed IDs at the perimeter with `422`.
4. Run `npm test`.
