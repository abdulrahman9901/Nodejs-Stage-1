import express from "express";
import { serverConfig } from "./config/server-config.js";
import { createWorkspaceRouter } from "./modules/workspaces/workspace.routes.js";

export function createApp({ workspaceRepo } = {}) {
  const app = express();
  app.use(express.json());

  app.get("/api/v1/health", (_req, res) => {
    return res.status(200).json({
      success: true,
      message: `${serverConfig.appName} Clean Architecture API is running`,
      data: { status: "UP", version: serverConfig.version },
    });
  });

  app.use("/api/v1/workspaces", createWorkspaceRouter(workspaceRepo));

  app.use((req, res) => {
    return res.status(404).json({
      success: false,
      errorCode: "NOT_FOUND",
      message: `Route ${req.method} ${req.originalUrl} not found`,
    });
  });

  app.use((err, _req, res, _next) => {
    const status = err.statusCode || 500;
    return res.status(status).json({
      success: false,
      errorCode: err.errorCode || "INTERNAL_ERROR",
      message: err.message || "Unexpected server error",
    });
  });

  return app;
}
