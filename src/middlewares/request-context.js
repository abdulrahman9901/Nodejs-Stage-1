import crypto from "node:crypto";

export function requestContextMiddleware(req, res, next) {
  // TODO(student): Attach req.requestId, set response header "X-Request-Id", and call next()!
  req.requestId = "";
}
