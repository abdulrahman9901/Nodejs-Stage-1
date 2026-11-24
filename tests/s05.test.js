import test from "node:test";
import assert from "node:assert/strict";
import { requestContextMiddleware } from "../src/middlewares/request-context.js";
import { createTaskHandler, nestedRouterOptions } from "../src/routes/task-handler.js";
import { createApp } from "../src/app.js";

function mockRes() {
  return {
    headers: {},
    statusCode: 200,
    sendCount: 0,
    body: null,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(payload) {
      this.sendCount += 1;
      if (this.sendCount > 1) throw new Error("ERR_HTTP_HEADERS_SENT");
      this.body = payload;
      return this;
    },
  };
}

test("S05: requestContextMiddleware attaches X-Request-Id and calls next()", () => {
  const req = { headers: {} };
  const res = mockRes();
  let nextCalled = false;
  requestContextMiddleware(req, res, () => { nextCalled = true; });
  assert.ok(req.requestId);
  assert.equal(res.headers["X-Request-Id"], req.requestId);
  assert.equal(nextCalled, true);
});

test("S05: createTaskHandler uses early return (no ERR_HTTP_HEADERS_SENT on invalid title)", () => {
  const res = mockRes();
  createTaskHandler({ params: {}, body: { title: "" } }, res);
  assert.equal(res.statusCode, 422);
  assert.equal(res.sendCount, 1);
});

test("S05: nestedRouterOptions enables mergeParams for /workspaces/:workspaceId/tasks", () => {
  assert.equal(nestedRouterOptions.mergeParams, true);
});

test("S05: Express app wires X-Request-Id, nested mergeParams router, 422, 400, and 404", async () => {
  const app = createApp();
  const server = await new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 1. Health endpoint returns X-Request-Id header
    const healthRes = await fetch(`${baseUrl}/api/v1/health`);
    assert.equal(healthRes.status, 200);
    const reqId = healthRes.headers.get("x-request-id");
    assert.ok(reqId, "Expected X-Request-Id response header");

    // 2. Nested POST /api/v1/workspaces/ws-1/tasks inherits :workspaceId via mergeParams
    const createRes = await fetch(`${baseUrl}/api/v1/workspaces/ws-1/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Ship Express router" }),
    });
    assert.equal(createRes.status, 201);
    const createBody = await createRes.json();
    assert.equal(createBody.success, true);
    assert.equal(createBody.data.workspaceId, "ws-1");
    assert.equal(createBody.data.title, "Ship Express router");

    // 3. Nested GET /api/v1/workspaces/ws-1/tasks lists the created task
    const listRes = await fetch(`${baseUrl}/api/v1/workspaces/ws-1/tasks`);
    assert.equal(listRes.status, 200);
    const listBody = await listRes.json();
    assert.equal(listBody.data.length, 1);
    assert.equal(listBody.data[0].title, "Ship Express router");

    // 4. Invalid title returns 422 without crashing with ERR_HTTP_HEADERS_SENT
    const invalidRes = await fetch(`${baseUrl}/api/v1/workspaces/ws-1/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "   " }),
    });
    assert.equal(invalidRes.status, 422);

    // 5. Malformed JSON hits 4-arg error middleware -> 400 BAD_JSON
    const badJsonRes = await fetch(`${baseUrl}/api/v1/workspaces/ws-1/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{ \"title\": \"broken\"",
    });
    assert.equal(badJsonRes.status, 400);
    const badJsonBody = await badJsonRes.json();
    assert.equal(badJsonBody.errorCode, "BAD_JSON");

    // 6. Unknown route hits 404 middleware
    const notFoundRes = await fetch(`${baseUrl}/api/v1/does-not-exist`);
    assert.equal(notFoundRes.status, 404);
    const notFoundBody = await notFoundRes.json();
    assert.equal(notFoundBody.errorCode, "NOT_FOUND");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
