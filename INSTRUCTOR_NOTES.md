# Instructor Explain Guide — Session 9: Zod Validation Gate & Global Error Handler

## Setup
```bash
npm install
npm run dev
```

## Live Demos (~1.5h Session Flow)
1. **Perimeter Validation with Zod (`src/middlewares/validate.js`)**:
   - Walk through `objectIdSchema`, `createTaskSchema` (validating `params.workspaceId` and `body.title`/`priority`/`status` together), and the reusable `validate(schema)` middleware returning `422 VALIDATION_ERROR` with `{ field, message }` issues.
2. **Operational vs. Programmer Errors (`src/utils/app-error.js`)**:
   - Explain `AppError` (`isOperational = true`) vs unexpected bugs (`TypeError`, leaked DB errors).
3. **Centralized Error Translation (`src/middlewares/error-handler.js`)**:
   - Show how `formatErrorResponse` & `globalErrorHandler` translate Prisma `P2002` → `409`, `P2025` → `404`, `P2023` → `400`, pass through operational `AppError`s, and scrub stack traces on `500` errors in `"production"`.
4. **Verify**: Run `npm test` (5/5 tests pass).
