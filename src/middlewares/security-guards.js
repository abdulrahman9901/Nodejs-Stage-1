import crypto from "node:crypto";
import path from "node:path";
import { verifyJwt } from "../modules/auth/crypto-auth.js";

export function authorizeRoles(...allowedRoles) {
  return (user) => {
    // TODO(student): Return 401 if !user, 403 if user.role is not in allowedRoles, 200 if allowed
    return { allowed: true, statusCode: 200 };
  };
}

export function authenticate(jwtSecret = "taskhub_s11_jwt_secret") {
  return (req, res, next) => {
    // TODO(student):
    // 1. Check req.headers?.authorization starts with "Bearer " -> else return 401
    // 2. Verify the token with verifyJwt(token, jwtSecret)
    // 3. Attach req.user = { id: decoded.sub, role: decoded.role, email: decoded.email } and call next()
    // 4. If verifyJwt throws, return 401
    return next();
  };
}

export function requireRoles(...allowedRoles) {
  const check = authorizeRoles(...allowedRoles);
  return (req, res, next) => {
    const result = check(req.user);
    if (!result.allowed) {
      return res.status(result.statusCode).json({
        success: false,
        errorCode: result.statusCode === 401 ? "UNAUTHENTICATED" : "FORBIDDEN",
        message: result.statusCode === 401 ? "Authentication required" : "Insufficient role permissions",
      });
    }
    return next();
  };
}

export function canDeleteWorkspace(workspace, requestingUser) {
  // TODO(student): IDOR BUG! Any logged-in manager can delete someone else's workspace!
  // Only allow if workspace.ownerId === requestingUser.id OR requestingUser.role === "ADMIN"
  return Boolean(requestingUser);
}

export function validateUploadFile({ mimetype, size }) {
  // TODO(student): Reject non-whitelisted MIME ("image/png", "image/jpeg", "image/webp", "application/pdf")
  // with { ok: false, statusCode: 415, errorCode: "INVALID_FILE_TYPE" },
  // and size > 5MB with { ok: false, statusCode: 413, errorCode: "LIMIT_FILE_SIZE" }
  return { ok: true, statusCode: 200 };
}

export function buildSafeUploadFilename(originalName) {
  // TODO(student): PATH TRAVERSAL BUG! Never return raw originalName (e.g. "../../.env.png")!
  // Generate a random filename using Date.now(), crypto.randomUUID(), and path.extname(originalName).toLowerCase()
  return originalName;
}
