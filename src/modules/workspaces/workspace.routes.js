import { Router } from "express";
import { WorkspaceRepository } from "./workspace.repository.js";
import { WorkspaceService } from "./workspace.service.js";
import { WorkspaceController } from "./workspace.controller.js";

/**
 * Composition root for the Workspaces module:
 * Repository -> Service -> Controller -> Express Router
 */
export function createWorkspaceRouter(workspaceRepo = new WorkspaceRepository()) {
  const service = new WorkspaceService(workspaceRepo);
  const controller = new WorkspaceController(service);

  const router = Router();
  router.get("/", controller.list);
  router.get("/:id", controller.getById);
  router.post("/", controller.create);
  router.delete("/:id", controller.remove);

  return router;
}
