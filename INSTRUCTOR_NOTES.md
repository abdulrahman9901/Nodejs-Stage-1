# Instructor Explain Guide — Session 12: Pagination Engine & Graceful Shutdown

## Setup
```bash
npm install
npm run dev
```

## Live Demos (~1.5h Session Flow)
1. **Pagination & Sort Whitelisting (`src/modules/tasks/query-engine.js`)**:
   - Walk through `parsePaginationParams`: `skip = (page - 1) * limit`, capping `limit` at `100` (preventing `?limit=10000000` OOM DoS), and whitelisting `sortBy` against `["createdAt", "title", "priority", "status"]`.
   - Show why `Promise.all([findManyFn(p), countFn(p)])` cuts database latency in half compared to sequential `await` calls, and how `meta` (`totalDocs`, `totalPages`, `hasNextPage`, `hasPrevPage`) is computed.
2. **Production `SIGTERM` Graceful Shutdown (`src/utils/graceful-shutdown.js`)**:
   - Explain the shutdown order when Docker/Kubernetes sends `SIGTERM`:
     1. Stop accepting new HTTP requests and drain in-flight requests (`server.close()`).
     2. Only after HTTP drains, close the DB connection pool (`prisma.$disconnect()`).
     3. Guard with `isShuttingDown` so duplicate signals don't trigger double disconnects.
3. **Live API Check**: Test `GET http://localhost:3000/api/v1/tasks?page=2&limit=5&sortBy=priority&order=asc` in Postman, then run `npm test` (5/5 tests pass).
