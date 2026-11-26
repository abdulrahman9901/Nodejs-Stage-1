import express from "express";
import { serverConfig } from "./config/server-config.js";
import { getPrismaClient } from "./config/prisma-singleton.js";
import { PrismaWorkspaceRepository } from "./modules/workspaces/workspace.prisma-repo.js";
import { WorkspaceService } from "./modules/workspaces/workspace.service.js";

export function createApp({ workspaceRepo } = {}) {
  const app = express();
  app.use(express.json());

  const repo = workspaceRepo || new PrismaWorkspaceRepository(getPrismaClient());
  const service = new WorkspaceService(repo);

  app.get("/api/v1/health", (_req, res) => {
    return res.status(200).json({
      success: true,
      message: `${serverConfig.appName} (Prisma + MongoDB) is running`,
      data: { status: "UP", version: serverConfig.version },
    });
  });

  app.get("/api/v1/workspaces", async (_req, res, next) => {
    try {
      const data = await service.listWorkspaces();
      return res.status(200).json({ success: true, message: "Workspaces fetched", data });
    } catch (err) {
      return next(err);
    }
  });

  app.post("/api/v1/workspaces", async (req, res, next) => {
    try {
      const data = await service.createWorkspace({
        name: req.body?.name,
        ownerId: req.body?.ownerId,
      });
      return res.status(201).json({ success: true, message: "Workspace created", data });
    } catch (err) {
      return next(err);
    }
  });

  app.delete("/api/v1/workspaces/:id", async (req, res, next) => {
    try {
      await service.deleteWorkspace(req.params.id);
      return res.status(204).end();
    } catch (err) {
      return next(err);
    }
  });

  app.use((err, _req, res, _next) => {
    return res.status(err.statusCode || 500).json({
      success: false,
      errorCode: err.errorCode || "INTERNAL_ERROR",
      message: err.message || "Internal Server Error",
    });
  });

  return app;
}
