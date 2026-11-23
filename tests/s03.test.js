import test from "node:test";
import assert from "node:assert/strict";
import { loadValidatedEnv } from "../src/config/env-validator.js";
import { runEventLoopDemo } from "../src/demos/event-loop-order.js";

test("S03: loadValidatedEnv fails fast when secrets are missing", () => {
  assert.throws(() => loadValidatedEnv({}), /Missing required environment variables/);
});

test("S03: loadValidatedEnv preserves 0 via nullish handling and freezes object", () => {
  const cfg = loadValidatedEnv({ DATABASE_URL: "mongodb://x", JWT_SECRET: "abc", TIMEOUT_MS: "0" });
  assert.equal(cfg.timeoutMs, 0);
  assert.equal(Object.isFrozen(cfg), true);
});

test("S03: Event loop executes Sync -> nextTick -> Promise -> setTimeout", async () => {
  const order = await runEventLoopDemo();
  assert.deepEqual(order, ["1-sync", "2-nextTick", "3-promise-microtask", "4-timer-macrotask"]);
});
