# Student Lab — Session 9: Zod Validation Gate & Global Error Handler

## Setup
```bash
npm install
```

## Part A: 24-Hex ObjectId & Centralized Error Translator (~20 min)
1. Open `src/middlewares/error-handler.js`.
2. Fix `isValidObjectId(id)` to check that `id` is a 24-character hexadecimal string.
3. Update `formatErrorResponse(err, nodeEnv = "production")`:
   - Translate Prisma error codes:
     - `P2002` → `statusCode: 409`, `errorCode: "DUPLICATE_RECORD"`
     - `P2025` → `statusCode: 404`, `errorCode: "RECORD_NOT_FOUND"`
     - `P2023` → `statusCode: 400`, `errorCode: "MALFORMED_OBJECT_ID"`
   - When `err.isOperational` is truthy (`AppError`), return `err.statusCode`, `err.errorCode`, and `err.message`.
   - For unexpected 500 errors in `"production"`, mask `message` as `"Internal Server Error"` and **omit** `stack`!

## Part B: Reusable Zod `validate(schema)` Middleware (~20 min)
1. Open `src/middlewares/validate.js`.
2. Inspect `objectIdSchema` and `createTaskSchema` (which validates both `params.workspaceId` and `body.title`/`priority`/`status`).
3. Implement `validate(schema)`:
   - Call `schema.safeParse({ body: req.body ?? {}, params: req.params ?? {}, query: req.query ?? {} })`.
   - When `!result.success`, map `result.error.issues` to `[{ field: issue.path.join("."), message: issue.message }]` and return `422` with `errorCode: "VALIDATION_ERROR"`.
   - When valid, assign the parsed `body`, `params`, and `query` back onto `req` (so trimmed strings and defaults take effect!) and call `next()`.

## Part C: Verify (~10 min)
1. Run `npm test` — all 5 tests must pass!
2. Run `npm run dev` and test `POST http://localhost:3000/api/v1/workspaces/65f1a9c0e4b0a1d2c3f4e5a6/tasks` in Postman with valid, invalid, and duplicate payloads.


> **Express 5 Note:** In Express 5 ESM, `req.query` is a read-only getter. Use `Object.defineProperty(req, "query", { value: result.data.query, writable: true, configurable: true, enumerable: true })` and `req.validated = result.data` inside `validate()`.
