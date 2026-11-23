import test from "node:test";
import assert from "node:assert/strict";
import { parsePaginationParams, runPaginatedQuery } from "../src/modules/tasks/query-engine.js";

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
