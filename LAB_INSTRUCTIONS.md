# Student Lab — Session 2: HTTP Status Codes & JSON Envelopes

## Tasks
1. Open `src/http/envelope.js`.
2. Fix `okEnvelope()` so it returns `{ success: true, message, data }`.
3. Fix `errorEnvelope()` so it returns `{ success: false, errorCode, message }` (and includes `errors` when non-empty).
4. Fix `getStatusForAction()` — right now it returns `200` for everything! Map `CREATE` (201), `DELETE` (204), `UNAUTHENTICATED` (401), `FORBIDDEN` (403), `CONFLICT` (409), and `VALIDATION_ERROR` (422).
5. Run `npm test` until all tests pass!
