# Student Lab — Session 3: Event Loop, Blocking Code & Pure ESM

## Part A: Fail-Fast Env Validator (~10 min)
1. Open `src/config/env-validator.js`.
2. Throw an `Error` containing `"Missing required environment variables"` if `DATABASE_URL` or `JWT_SECRET` is missing.
3. Fix the `||` bug so `TIMEOUT_MS: "0"` evaluates to `0` (not `5000`!).
4. Freeze the returned config object using `Object.freeze()`.

## Part B: Predict Event Loop Execution Priority (~10 min)
1. Open `src/demos/event-loop-order.js`.
2. Read `runEventLoopDemo()` carefully (notice `sync`, `setTimeout(..., 0)`, `Promise.resolve().then(...)`, and `process.nextTick(...)`).
3. Fix `getExpectedEventLoopOrder()` so it returns those 4 labels in the **exact** order Node.js executes them.

## Part C: Unblock the Event Loop & Pure ESM File Loading (~20–25 min)
1. Open `src/demos/blocking-fix.js`.
2. Refactor `countPrimesNonBlocking(limit, chunkSize = 2000)` so it processes numbers in chunks of `chunkSize` and yields back to the Event Loop between chunks using `await new Promise((resolve) => setImmediate(resolve))`.
3. Implement `readPackageJsonAsync()` using Pure ESM (`new URL("../../package.json", import.meta.url)` + `fileURLToPath`) and `readFile` from `node:fs/promises` (no `__dirname` and no `readFileSync`!).

## Verify
Run `npm test` — all 6 tests must pass!
