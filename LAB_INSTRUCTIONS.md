# Student Lab — Session 12: Pagination Engine, Sort Whitelisting & Graceful Shutdown

## Setup
```bash
npm install
```

## Part A: Pagination Engine & Sort Whitelisting (~20 min)
1. Open `src/modules/tasks/query-engine.js`.
2. Implement `parsePaginationParams({ page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = {})`:
   - Coerce `page` (minimum `1`) and `limit` (minimum `1`, **maximum `100`** to prevent `?limit=99999999` OOM attacks!).
   - Compute `skip = (safePage - 1) * safeLimit` and `take = safeLimit`.
   - Whitelist `sortBy` against `["createdAt", "title", "priority", "status"]` (fallback to `"createdAt"`).
   - Normalize `order` (`"asc"` if `"asc"`, otherwise `"desc"`).
3. Implement `runPaginatedQuery(findManyFn, countFn, params)`:
   - Execute `findManyFn(p)` and `countFn(p)` **in parallel** using `Promise.all()`.
   - Compute `totalPages = Math.ceil(totalDocs / p.limit) || 1`.
   - Return `{ items, meta: { page, limit, totalDocs, totalPages, hasNextPage, hasPrevPage } }`.

## Part B: Production `SIGTERM` Graceful Shutdown (~15 min)
1. Open `src/utils/graceful-shutdown.js`.
2. Implement `createGracefulShutdown({ server, prisma })`:
   - Guard against duplicate signals with `let isShuttingDown = false` (return `{ executed: false, signal }` if already shutting down).
   - Drain in-flight HTTP requests first (`server.close(...)`).
   - Disconnect the database connection pool second (`await prisma.$disconnect()`).
   - Return `{ executed: true, signal }`.

## Verify
Run `npm test` — all 5 capstone tests must pass!
