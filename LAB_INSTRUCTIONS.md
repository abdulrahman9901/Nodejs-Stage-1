# Student Lab — Session 12: Capstone Pagination Engine & Sort Whitelisting

## Tasks in `src/modules/tasks/query-engine.js`
1. Implement `parsePaginationParams()`:
   - Coerce `page` (min 1) and `limit` (min 1, **max 100** to prevent OOM!).
   - Compute `skip = (page - 1) * limit` and `take = limit`.
   - Whitelist `sortBy` against `["createdAt", "title", "priority", "status"]` (fallback `"createdAt"`).
2. Implement `runPaginatedQuery(findManyFn, countFn, params)`:
   - Execute `findManyFn(p)` and `countFn(p)` in parallel via `Promise.all()`.
   - Return `{ items, meta: { page, limit, totalDocs, totalPages, hasNextPage, hasPrevPage } }`.
3. Run `npm test`.
