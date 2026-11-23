import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { getPrismaSingleton } from "../src/config/prisma-singleton.js";

test("S08: schema.prisma configures MongoDB ObjectId mapping, Cascade delete, and ESR @@index", () => {
  const schema = fs.readFileSync("prisma/schema.prisma", "utf-8");
  assert.match(schema, /provider\s*=\s*"mongodb"/);
  assert.match(schema, /@map\("_id"\)\s+@db\.ObjectId/);
  assert.match(schema, /onDelete:\s*Cascade/);
  assert.match(schema, /@@index\(\[workspaceId,\s*status/);
});

test("S08: getPrismaSingleton reuses the exact same instance across hot reloads", () => {
  let count = 0;
  const fakeGlobal = {};
  const c1 = getPrismaSingleton(() => ({ id: ++count }), fakeGlobal);
  const c2 = getPrismaSingleton(() => ({ id: ++count }), fakeGlobal);
  assert.equal(c1, c2);
  assert.equal(count, 1);
});
