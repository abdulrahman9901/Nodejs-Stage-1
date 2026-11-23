# Student Lab — Session 3: Event Loop Priority & Fail-Fast Env Validator

## Tasks
1. Open `src/config/env-validator.js`:
   - Throw an Error containing `"Missing required environment variables"` if `DATABASE_URL` or `JWT_SECRET` is missing.
   - Fix the `||` bug so `TIMEOUT_MS: "0"` evaluates to `0` (not `5000`!).
   - Freeze the returned config object using `Object.freeze()`.
2. Open `src/demos/event-loop-order.js` and fix `expectedOrder` to match the true Node.js Event Loop execution priority!
3. Run `npm test` until all tests pass.
