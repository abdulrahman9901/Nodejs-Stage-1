import test from "node:test";
import assert from "node:assert/strict";
import { requestContextMiddleware } from "../src/middlewares/request-context.js";
import { createTaskHandler, nestedRouterOptions } from "../src/routes/task-handler.js";

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
