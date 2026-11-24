import { Router } from "express";
import { createTaskRouter } from "./task-handler.js";

const DEFAULT_WORKSPACES = [
  { id: "ws-1", name: "Engineering" },
  { id: "ws-2", name: "Design" },
];

export function createWorkspaceRouter(initialWorkspaces = DEFAULT_WORKSPACES, initialTasks = []) {
  const router = Router();
  const workspaces = initialWorkspaces.map((w) => ({ ...w }));
  const tasks = initialTasks.map((t) => ({ ...t }));

  router.get("/", (_req, res) => {
    return res.status(200).json({
      success: true,
      message: "Workspaces fetched",
      data: workspaces,
    });
  });

  router.get("/:workspaceId", (req, res) => {
    const ws = workspaces.find((w) => w.id === req.params.workspaceId);
    if (!ws) {
      return res.status(404).json({
        success: false,
        errorCode: "NOT_FOUND",
        message: `Workspace "${req.params.workspaceId}" not found`,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Workspace fetched",
      data: ws,
    });
  });

  // Mount nested child router: child MUST enable { mergeParams: true } to read :workspaceId
  router.use("/:workspaceId/tasks", createTaskRouter(tasks));

  return router;
}
