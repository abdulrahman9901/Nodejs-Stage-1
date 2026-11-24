# Instructor Explain Guide — Session 3: Event Loop & Pure ESM

## Live Demos (~1.5h Session Flow)
1. **Event Loop Priority (`node src/demos/event-loop-order.js`)**:
   - Run the script live to prove: `sync` → `nextTick` → `promise-microtask` → `timer-macrotask`.
   - Explain why the demo wraps work inside `setImmediate()` (top-level ESM runs inside a Promise microtask).
2. **Blocking vs. Non-Blocking Event Loop (`node src/demos/blocking-fix.js`)**:
   - Show how `countPrimesBlocking()` freezes the `setInterval` heartbeat (`ticks=0`), while `countPrimesNonBlocking()` yields via `setImmediate()` between chunks so timers/requests stay responsive.
   - Walk through `readPackageJsonAsync()` to explain Pure ESM (`import.meta.url` + `fileURLToPath` instead of CommonJS `__dirname`, plus explicit `.js` extensions and `fs/promises`).
3. **Fail-Fast Env Config (`src/config/env-validator.js`)**:
   - Explain fail-fast boot checks (`DATABASE_URL`, `JWT_SECRET`), why `||` breaks `TIMEOUT_MS="0"`, and why `Object.freeze()` protects runtime config.
4. **Verify**: Run `npm test` to confirm all 6 tests pass.
