import express from "express";
import {
  authenticate,
  requireRoles,
  canDeleteWorkspace,
  validateUploadFile,
  buildSafeUploadFilename,
} from "./middlewares/security-guards.js";

const DEFAULT_WORKSPACES = [
  { id: "ws_1", name: "Manager A Workspace", ownerId: "user_A" },
  { id: "ws_2", name: "Manager B Workspace", ownerId: "user_B" },
];

export function createApp({
  jwtSecret = "taskhub_s11_jwt_secret",
  initialWorkspaces = DEFAULT_WORKSPACES,
} = {}) {
  const app = express();
  const workspaces = initialWorkspaces.map((w) => ({ ...w }));

  app.use(express.json());

  // 1. Protected DELETE /api/v1/workspaces/:id (Auth 401 -> RBAC 403 -> Ownership IDOR check 403 -> 204)
  app.delete(
    "/api/v1/workspaces/:id",
    authenticate(jwtSecret),
    requireRoles("ADMIN", "MANAGER"),
    (req, res) => {
      const idx = workspaces.findIndex((w) => w.id === req.params.id);
      if (idx === -1) {
        return res.status(404).json({
          success: false,
          errorCode: "NOT_FOUND",
          message: "Workspace not found",
        });
      }

      if (!canDeleteWorkspace(workspaces[idx], req.user)) {
        return res.status(403).json({
          success: false,
          errorCode: "IDOR_FORBIDDEN",
          message: "You do not own this workspace",
        });
      }

      workspaces.splice(idx, 1);
      return res.status(204).end();
    }
  );

  // 2. Protected POST /api/v1/uploads (Auth 401 -> MIME 415 -> Size 413 -> Path Traversal Safe Filename 201)
  app.post("/api/v1/uploads", authenticate(jwtSecret), (req, res) => {
    const { originalName = "file.bin", mimetype = "", size = 0 } = req.body || {};
    const validation = validateUploadFile({ mimetype, size });
    if (!validation.ok) {
      return res.status(validation.statusCode).json({
        success: false,
        errorCode: validation.errorCode,
        message: "File upload rejected by security policy",
      });
    }

    const storedFilename = buildSafeUploadFilename(originalName);
    return res.status(201).json({
      success: true,
      message: "File upload validated",
      data: { storedFilename, mimetype, size },
    });
  });

  return app;
}
