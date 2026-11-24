import test from "node:test";
import assert from "node:assert/strict";
import { loadValidatedEnv } from "../src/config/env-validator.js";
import { runEventLoopDemo, getExpectedEventLoopOrder } from "../src/demos/event-loop-order.js";
import { countPrimesNonBlocking, readPackageJsonAsync } from "../src/demos/blocking-fix.js";

test("S03: loadValidatedEnv fails fast when secrets are missing", () => {
  assert.throws(() => loadValidatedEnv({}), /Missing required environment variables/);
});

test("S03: loadValidatedEnv preserves 0 via nullish handling and freezes object", () => {
  const cfg = loadValidatedEnv({ DATABASE_URL: "mongodb://x", JWT_SECRET: "abc", TIMEOUT_MS: "0" });
  assert.equal(cfg.timeoutMs, 0);
  assert.equal(Object.isFrozen(cfg), true);
});

test("S03: Predicted Event Loop order matches real Node.js runtime", async () => {
  const actualOrder = await runEventLoopDemo();
  assert.deepEqual(getExpectedEventLoopOrder(), actualOrder);
});

test("S03: countPrimesNonBlocking computes primes without starving the Event Loop", async () => {
  let timerFiredBeforeCompletion = false;
  let completed = false;

  setTimeout(() => {
    if (!completed) timerFiredBeforeCompletion = true;
  }, 0);

  const count = await countPrimesNonBlocking(25_000, 2000);
  completed = true;

  assert.equal(count, 2762);
  assert.equal(
    timerFiredBeforeCompletion,
    true,
    "Expected Event Loop timer to fire while countPrimesNonBlocking yielded between chunks"
  );
});

test("S03: readPackageJsonAsync reads package.json using Pure ESM import.meta.url", async () => {
  const pkg = await readPackageJsonAsync();
  assert.equal(pkg.name, "taskhub-course-lab");
  assert.equal(pkg.type, "module");
});
