# Instructor Explain Guide — Session 2: HTTP, REST & Postman

## Live Demos
1. Inspect `src/http/envelope.js` — standardized `{ success, message, data, errorCode }` contract.
2. Run `node src/http/contract-server.js` and test `GET /api/v1/workspaces`, `POST /api/v1/workspaces` (201 vs 422), and `DELETE /api/v1/workspaces/:id` (204 vs 404).
3. Run `npm test` to verify all REST status codes and envelopes.
