import crypto from "node:crypto";
import path from "node:path";

export function authorizeRoles(...allowedRoles) {
  return (user) => {
    // TODO(student): Return 401 if !user, 403 if role not in allowedRoles, 200 if allowed
    return { allowed: true, statusCode: 200 };
  };
}

export function canDeleteWorkspace(workspace, requestingUser) {
  // TODO(student): IDOR BUG! Any logged-in manager can delete someone else's workspace!
  return Boolean(requestingUser);
}

export function validateUploadFile({ mimetype, size }) {
  // TODO(student): Reject non-whitelisted MIME with 415 and size > 5MB with 413
  return { ok: true, statusCode: 200 };
}

export function buildSafeUploadFilename(originalName) {
  // TODO(student): PATH TRAVERSAL BUG! Never return raw originalName (e.g. "../../.env.png")!
  return originalName;
}
