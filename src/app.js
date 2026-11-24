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

  // 4. TODO(student): Add a 404 catch-all middleware returning status 404 with:
  //    { success: false, errorCode: "NOT_FOUND", message: `Route ${req.method} ${req.originalUrl} not found`, requestId: req.requestId }

  // 5. TODO(student): Add a 4-argument Express error middleware (err, req, res, _next)
  //    that catches malformed JSON SyntaxError (err.status === 400 && "body" in err)
  //    and returns status 400 with { success: false, errorCode: "BAD_JSON", message: "Malformed JSON request body", requestId: req.requestId }

  return app;
}
