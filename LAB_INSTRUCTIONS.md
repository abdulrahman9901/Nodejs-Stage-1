# Student Lab — Session 5: Express Routing, Middleware & Error Handling

## Setup
```bash
npm install
```

## Part A: Correlation-ID Middleware (~10 min)
1. Open `src/middlewares/request-context.js`.
2. Set `req.requestId` to `req.headers?.["x-request-id"] || crypto.randomUUID()`.
3. Echo it back with `res.setHeader("X-Request-Id", req.requestId)`.
4. Call `next()` so requests don't hang forever!

## Part B: Early `return` & Nested Router `mergeParams` (~15 min)
1. Open `src/routes/task-handler.js`.
2. Fix the missing `return` bug in `createTaskHandler()` that causes `ERR_HTTP_HEADERS_SENT` when `title` is empty.
3. Set `nestedRouterOptions = { mergeParams: true }` so the nested `/api/v1/workspaces/:workspaceId/tasks` router can read `req.params.workspaceId`.

## Part C: 404 Catch-All & 4-Arg Error Middleware (~15 min)
1. Open `src/app.js` (notice how `app.js` is separated from `src/server.js`!).
2. Add a 404 catch-all middleware at the end of the routes returning status `404` and `{ success: false, errorCode: "NOT_FOUND", ... }`.
3. Add a 4-argument Express error middleware `(err, req, res, _next)` that catches malformed JSON (`err instanceof SyntaxError && err.status === 400 && "body" in err`) and returns status `400` with `errorCode: "BAD_JSON"`.

## Part D: Run & Verify (~10 min)
1. Run `npm test` — all 5 tests must pass!
2. Start the live Express server with `npm run dev` and test in Postman:
   - `GET http://localhost:3000/api/v1/health` (check `X-Request-Id` header)
   - `POST http://localhost:3000/api/v1/workspaces/ws-1/tasks` with `{ "title": "Build API" }` (`201`)
   - `GET http://localhost:3000/api/v1/workspaces/ws-1/tasks` (`200`)
   - `POST http://localhost:3000/api/v1/workspaces/ws-1/tasks` with malformed JSON (`400 BAD_JSON`)
   - `GET http://localhost:3000/api/v1/unknown` (`404 NOT_FOUND`)
