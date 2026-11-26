# Instructor Explain Guide — Session 2: HTTP, REST & Postman

## Live Demos
1. Inspect `src/http/envelope.js` — standardized `{ success, message, data }` and `{ success, errorCode, message, errors? }` contract plus `getStatusForAction()`.
2. Run `node src/http/contract-server.js` to start the in-memory REST server on `http://localhost:3000`.
3. Import `postman/TaskHub-S02.postman_collection.json` in Postman (uses `{{baseUrl}}` + built-in `pm.test()` scripts) and demonstrate each status code & method live:
   - `GET /api/v1/workspaces` → `200 OK`
   - `POST /api/v1/workspaces` (valid body) → `201 Created`
   - `POST /api/v1/workspaces` (empty/short `name`) → `422 Unprocessable Entity`
   - `POST /api/v1/workspaces` (malformed JSON) → `400 Bad Request`
   - `POST /api/v1/workspaces` (duplicate `name`) → `409 Conflict`
   - `PATCH /api/v1/workspaces/ws-2` (explain `PUT` full replace vs `PATCH` partial update & HTTP idempotency) → `200 OK`
   - `DELETE /api/v1/workspaces/ws-2` → `204 No Content` (empty body!)
   - `DELETE /api/v1/workspaces/does-not-exist` → `404 Not Found`
4. Run `npm test` to verify all REST status codes, envelopes, and live HTTP contract endpoints pass.
