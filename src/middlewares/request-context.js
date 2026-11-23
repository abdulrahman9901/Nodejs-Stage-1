import crypto from "node:crypto";

export function requestContextMiddleware(req, res, next) {
  req.requestId = req.headers?.["x-request-id"] || crypto.randomUUID();
  res.setHeader("X-Request-Id", req.requestId);
  next();
}
