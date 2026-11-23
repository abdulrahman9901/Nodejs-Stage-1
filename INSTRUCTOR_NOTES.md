# Instructor Explain Guide — Session 3: Event Loop & Pure ESM

## Live Demos
1. Run `node src/demos/event-loop-order.js` to prove: Sync -> `process.nextTick` -> Promise Microtask -> `setTimeout(0)`.
2. Inspect `src/config/env-validator.js` — fail-fast validation + `Object.freeze()` + nullish coalescing (`??`).
3. Run `npm test`.
