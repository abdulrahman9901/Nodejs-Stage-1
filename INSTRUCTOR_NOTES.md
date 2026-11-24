# Instructor Explain Guide — Session 5: Express Routing & Middleware

## Setup
```bash
npm install
npm run dev
```

## Live Demos (~1.5h Session Flow)
1. **`src/app.js` vs `src/server.js` separation**:
   - Explain why `createApp()` lives in `src/app.js` (no `.listen()`) while `src/server.js` boots the port — makes automated HTTP testing clean with zero port conflicts.
2. **Custom Middleware (`src/middlewares/request-context.js`)**:
   - Attaches `req.requestId` (UUID) & `X-Request-Id` header and calls `next()`. Show what happens when `next()` is omitted (request hangs!).
3. **Nested Routers & `mergeParams: true` (`src/routes/workspace-router.js` + `src/routes/task-handler.js`)**:
   - Test `POST /api/v1/workspaces/ws-1/tasks` and `GET /api/v1/workspaces/ws-1/tasks` in Postman.
   - Show the mandatory early `return` rule preventing `ERR_HTTP_HEADERS_SENT` on invalid `title` (`422`).
4. **404 Catch-All & 4-Argument Error Middleware (`src/app.js`)**:
   - Send malformed JSON (`400 BAD_JSON`) and an unknown route (`404 NOT_FOUND`) to show middleware ordering.
5. **Verify**: Run `npm test` (6/6 tests pass).
