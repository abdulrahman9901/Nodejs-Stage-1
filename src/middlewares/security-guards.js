import crypto from "node:crypto";
import path from "node:path";
import { verifyJwt } from "../modules/auth/crypto-auth.js";

export function authorizeRoles(...allowedRoles) {
  return (user) => {
    if (!user) return { allowed: false, statusCode: 401 };
    if (!allowedRoles.includes(user.role)) return { allowed: false, statusCode: 403 };
    return { allowed: true, statusCode: 200 };
  };
}

/**
 * Express middleware that extracts `Authorization: Bearer <token>`,
 * verifies the JWT signature & expiration, and attaches `req.user`.
 */
export function authenticate(jwtSecret = "taskhub_s11_jwt_secret") {
  return (req, res, next) => {
    const authHeader = req.headers?.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        errorCode: "UNAUTHENTICATED",
        message: "Missing or invalid Bearer token",
      });
    }

    const token = authHeader.slice("Bearer ".length).trim();
    try {
      const decoded = verifyJwt(token, jwtSecret);
      req.user = { id: decoded.sub, role: decoded.role, email: decoded.email };
      return next();
    } catch {
      return res.status(401).json({
        success: false,
        errorCode: "UNAUTHENTICATED",
        message: "Invalid or expired token",
      });
    }
  };
}

/**
 * Express RBAC guard middleware wrapping authorizeRoles(...allowedRoles).
 */
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
  if (!requestingUser) return false;
  return workspace.ownerId === requestingUser.id || requestingUser.role === "ADMIN";
}

const ALLOWED_MIMES = new Set(["image/png", "image/jpeg", "image/webp", "application/pdf"]);
const MAX_BYTES = 5 * 1024 * 1024;

export function validateUploadFile({ mimetype, size }) {
  if (!ALLOWED_MIMES.has(mimetype)) {
    return { ok: false, statusCode: 415, errorCode: "INVALID_FILE_TYPE" };
  }
  if (size > MAX_BYTES) {
    return { ok: false, statusCode: 413, errorCode: "LIMIT_FILE_SIZE" };
  }
  return { ok: true, statusCode: 200 };
}

export function buildSafeUploadFilename(originalName) {
  const ext = path.extname(originalName).toLowerCase();
  return `${Date.now()}-${crypto.randomUUID()}${ext}`;
}
