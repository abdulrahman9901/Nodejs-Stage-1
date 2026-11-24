import express from "express";
import { serverConfig } from "./config/server-config.js";
import { requestContextMiddleware } from "./middlewares/request-context.js";
import { createWorkspaceRouter } from "./routes/workspace-router.js";

export function createApp() {
  const app = express();

  // 1. Built-in JSON body parser + custom correlation-ID middleware
  app.use(express.json());
  app.use(requestContextMiddleware);

  // 2. Health endpoint
  app.get("/api/v1/health", (req, res) => {
    return res.status(200).json({
      success: true,
      message: `${serverConfig.appName} Express server is running`,
      data: {
        status: "UP",
        version: serverConfig.version,
        requestId: req.requestId,
      },
    });
  });

  // 3. Domain routers
  app.use("/api/v1/workspaces", createWorkspaceRouter());

  // 4. 404 catch-all middleware (runs when no route matched)
  app.use((req, res) => {
    return res.status(404).json({
      success: false,
      errorCode: "NOT_FOUND",
      message: `Route ${req.method} ${req.originalUrl} not found`,
      requestId: req.requestId,
    });
  });

  // 5. Centralized 4-argument Express error middleware
  app.use((err, req, res, _next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      return res.status(400).json({
        success: false,
        errorCode: "BAD_JSON",
        message: "Malformed JSON request body",
        requestId: req.requestId,
      });
    }

    return res.status(err.statusCode || 500).json({
      success: false,
      errorCode: "INTERNAL_ERROR",
      message: err.message || "Unexpected server error",
      requestId: req.requestId,
    });
  });

  return app;
}
