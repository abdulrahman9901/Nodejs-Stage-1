import test from "node:test";
import assert from "node:assert/strict";
import { parsePaginationParams, runPaginatedQuery } from "../src/modules/tasks/query-engine.js";
import { createGracefulShutdown } from "../src/utils/graceful-shutdown.js";
import { createApp } from "../src/app.js";

test("S12: parsePaginationParams computes skip/take, caps limit at 100, and whitelists sortBy", () => {
  const p = parsePaginationParams({ page: "3", limit: "500", sortBy: "passwordHash", order: "asc" });
  assert.equal(p.page, 3);
  assert.equal(p.limit, 100);
  assert.equal(p.skip, 200);
  assert.equal(p.sortBy, "createdAt");
  assert.equal(p.order, "asc");
});

test("S12: runPaginatedQuery computes meta envelope accurately", async () => {
  const res = await runPaginatedQuery(
    async () => [{ id: "1" }, { id: "2" }],
    async () => 25,
    { page: 2, limit: 10 }
  );
  assert.equal(res.meta.totalDocs, 25);
  assert.equal(res.meta.totalPages, 3);
  assert.equal(res.meta.hasNextPage, true);
  assert.equal(res.meta.hasPrevPage, true);
});

test("S12: createGracefulShutdown drains HTTP server before disconnecting Prisma and is idempotent", async () => {
  const events = [];
  const fakeServer = {
    close(cb) {
      events.push("1-http-closed");
      cb();
    },
  };
  const fakePrisma = {
    async $disconnect() {
      events.push("2-db-disconnected");
    },
  };

  const shutdown = createGracefulShutdown({ server: fakeServer, prisma: fakePrisma });
  const first = await shutdown("SIGTERM");
  const second = await shutdown("SIGINT");

  assert.equal(first.executed, true);
  assert.equal(second.executed, false, "Duplicate shutdown signal must be ignored");
  assert.deepEqual(events, ["1-http-closed", "2-db-disconnected"]);
});

test("S12: Express GET /api/v1/tasks serves paginated items with meta envelope", async () => {
  const app = createApp();
  const server = await new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    const res = await fetch(`${baseUrl}/api/v1/tasks?page=2&limit=5&sortBy=priority&order=asc`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.length, 5);
    assert.deepEqual(body.meta, {
      page: 2,
      limit: 5,
      totalDocs: 25,
      totalPages: 5,
      hasNextPage: true,
      hasPrevPage: true,
    });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
