import crypto from "node:crypto";
import path from "node:path";

export function authorizeRoles(...allowedRoles) {
  return (user) => {
    if (!user) return { allowed: false, statusCode: 401 };
    if (!allowedRoles.includes(user.role)) return { allowed: false, statusCode: 403 };
    return { allowed: true, statusCode: 200 };
  };
}

export function canDeleteWorkspace(workspace, requestingUser) {
  if (!requestingUser) return false;
  return workspace.ownerId === requestingUser.id || requestingUser.role === "ADMIN";
}

const ALLOWED_MIMES = new Set(["image/png", "image/jpeg", "image/webp", "application/pdf"]);
const MAX_BYTES = 5 * 1024 * 1024;

export function validateUploadFile({ mimetype, size }) {
  if (!ALLOWED_MIMES.has(mimetype)) return { ok: false, statusCode: 415, errorCode: "INVALID_FILE_TYPE" };
  if (size > MAX_BYTES) return { ok: false, statusCode: 413, errorCode: "LIMIT_FILE_SIZE" };
  return { ok: true, statusCode: 200 };
}

export function buildSafeUploadFilename(originalName) {
  const ext = path.extname(originalName).toLowerCase();
  return `${Date.now()}-${crypto.randomUUID()}${ext}`;
}
