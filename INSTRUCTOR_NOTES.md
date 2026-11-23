# Instructor Explain Guide — Session 5: Express Middleware & Routing

## Live Demos
1. `src/middlewares/request-context.js` — attaches `req.requestId` (UUID) & `X-Request-Id` header without forgetting `next()`.
2. `src/routes/task-handler.js` — demonstrates the mandatory early `return` rule preventing `ERR_HTTP_HEADERS_SENT`.
3. `src/routes/nested-router-config.js` — explains `mergeParams: true` for `/workspaces/:workspaceId/tasks`.
4. Run `npm test`.
