# Student Lab — Session 5: Express Middlewares & Avoiding ERR_HTTP_HEADERS_SENT

## Tasks
1. Open `src/middlewares/request-context.js`:
   - Generate a UUID with `crypto.randomUUID()` when `x-request-id` header is absent.
   - Set `res.setHeader("X-Request-Id", req.requestId)` and remember to call `next()`!
2. Open `src/routes/task-handler.js`:
   - Fix the missing `return` bug that causes `ERR_HTTP_HEADERS_SENT` when `title` is empty!
   - Enable `mergeParams: true` in `nestedRouterOptions`.
3. Run `npm test`.
