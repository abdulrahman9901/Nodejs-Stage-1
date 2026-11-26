# Student Lab — Session 2: HTTP Status Codes, JSON Envelopes & Postman

## Part A: Fix the Envelope & Status Code Contract (~15 min)
1. Open `src/http/envelope.js`.
2. Fix `okEnvelope(message, data = null)` so it returns `{ success: true, message, data }`.
3. Fix `errorEnvelope(errorCode, message, errors = [])` so it returns `{ success: false, errorCode, message }` and **only** includes `errors` when `errors` is non-empty.
4. Fix `getStatusForAction(action)` — right now it returns `200` for everything! Map:
   - `READ` → `200`
   - `CREATE` → `201`
   - `DELETE` → `204`
   - `BAD_JSON` → `400`
   - `UNAUTHENTICATED` → `401`
   - `FORBIDDEN` → `403`
   - `NOT_FOUND` → `404`
   - `CONFLICT` → `409`
   - `VALIDATION_ERROR` → `422`
   - Unknown action → `500`
5. Run `npm test` — all 5 tests in `tests/base.test.js` and `tests/s02.test.js` (including the live `contract-server.js` HTTP checks) must pass!

---

## Part B: Hands-On Postman API Testing Lab (~25–30 min)
Once `npm test` is green, start the in-memory REST server that uses your `envelope.js`:
```bash
node src/http/contract-server.js
```

### 1. Set Up Your Postman Collection & `{{baseUrl}}` Variable
1. Open Postman and create a new Collection named **TaskHub S02**.
2. Open the Collection → **Variables** tab → add a variable:
   - **Variable:** `baseUrl`
   - **Initial & Current Value:** `http://localhost:3000`
3. Save the collection and use `{{baseUrl}}` in every request URL below (never hardcode `localhost:3000`).

### 2. Trigger & Verify Every HTTP Method, Status Code & Envelope
Create and run each request inside your **TaskHub S02** collection, and verify **both** the HTTP status code and the JSON envelope:

| # | Request | Body / Headers | Expected Status | What to Verify |
| :--- | :--- | :--- | :---: | :--- |
| 1 | `GET {{baseUrl}}/api/v1/workspaces` | None | **200 OK** | `success: true`, `data` has 2 seeded workspaces (`ws-1`, `ws-2`) |
| 2 | `POST {{baseUrl}}/api/v1/workspaces` | `Content-Type: application/json`<br>`{ "name": "Product" }` | **201 Created** | `success: true`, `data.id` generated, `data.name === "Product"` |
| 3 | `POST {{baseUrl}}/api/v1/workspaces` | `Content-Type: application/json`<br>`{ "name": "" }` | **422 Unprocessable Entity** | `success: false`, `errorCode: "VALIDATION_ERROR"`, `errors` array has 1 item for `field: "name"` |
| 4 | `POST {{baseUrl}}/api/v1/workspaces` | `Content-Type: application/json`<br>`{ "name": "Broken JSON"` *(missing closing `}`)* | **400 Bad Request** | `success: false`, `errorCode: "BAD_JSON"` |
| 5 | `POST {{baseUrl}}/api/v1/workspaces` | `Content-Type: application/json`<br>`{ "name": "Engineering" }` | **409 Conflict** | `success: false`, `errorCode: "CONFLICT"`, no `errors` key |
| 6 | `PATCH {{baseUrl}}/api/v1/workspaces/ws-2` | `Content-Type: application/json`<br>`{ "name": "Product Design" }` | **200 OK** | `success: true`, `data.name === "Product Design"`, `updatedAt` added (partial update, idempotent!) |
| 7 | `DELETE {{baseUrl}}/api/v1/workspaces/ws-2` | None | **204 No Content** | Response body is completely **empty** |
| 8 | `DELETE {{baseUrl}}/api/v1/workspaces/does-not-exist` | None | **404 Not Found** | `success: false`, `errorCode: "NOT_FOUND"` |

### 3. Add Automated Postman Assertions (`pm.test`)
In Request #2 (`POST /api/v1/workspaces`), open the **Scripts → Post-response** tab (or **Tests** tab) and add:
```javascript
pm.test("Status is 201", () => pm.response.to.have.status(201));
pm.test("Envelope success is true", () => pm.expect(pm.response.json().success).to.eql(true));
```
Send the request and verify the **Test Results** tab shows `2/2 Passed`!

### 4. Bonus Challenge
Re-run Request #1 (`GET {{baseUrl}}/api/v1/workspaces`) and confirm `"ws-2"` is gone and `"Product"` is now in the list. Export your Postman collection as JSON!
