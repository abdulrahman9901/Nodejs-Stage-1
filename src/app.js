import express from "express";
import multer from "multer";
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

const upload = multer({ storage: multer.memoryStorage() });

function parseUploadBody(req, res, next) {
  if (req.is("multipart/form-data")) {
    return upload.single("file")(req, res, next);
  }
  return next();
}

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

  // 2. Protected POST /api/v1/uploads (Auth 401 -> Multer multipart/form-data or JSON -> MIME 415 -> Size 413 -> 201)
  app.post("/api/v1/uploads", authenticate(jwtSecret), parseUploadBody, (req, res) => {
    const fileInfo = req.file
      ? { originalName: req.file.originalname, mimetype: req.file.mimetype, size: req.file.size }
      : {
          originalName: req.body?.originalName || "file.bin",
          mimetype: req.body?.mimetype || "",
          size: req.body?.size || 0,
        };

    const validation = validateUploadFile({ mimetype: fileInfo.mimetype, size: fileInfo.size });
    if (!validation.ok) {
      return res.status(validation.statusCode).json({
        success: false,
        errorCode: validation.errorCode,
        message: "File upload rejected by security policy",
      });
    }

    const storedFilename = buildSafeUploadFilename(fileInfo.originalName);
    return res.status(201).json({
      success: true,
      message: "File upload validated",
      data: {
        storedFilename,
        mimetype: fileInfo.mimetype,
        size: fileInfo.size,
      },
    });
  });

  return app;
}
