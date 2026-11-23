# Instructor Explain Guide — Session 12: Pagination Engine & Graceful Shutdown

## Live Demos
1. `src/modules/tasks/query-engine.js` — `skip`/`take` math, max `limit: 100` cap, sort field whitelist, parallel `Promise.all([findMany, count])` pagination with `meta` envelope.
2. Run `npm test` to verify Capstone v1.0.0 checks.
