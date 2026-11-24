import crypto from "node:crypto";
import { Router } from "express";

export const nestedRouterOptions = { mergeParams: true };

export function createTaskHandler(req, res, tasksStore = null) {
  const workspaceId = req.params?.workspaceId || req.body?.workspaceId || null;
  const title = req.body?.title?.trim();

  if (!title) {
    return res.status(422).json({
      success: false,
      errorCode: "VALIDATION_ERROR",
      message: "Task title is required",
    });
  }

  const task = {
    id: `task-${crypto.randomUUID().slice(0, 8)}`,
    title,
    workspaceId,
    status: "TODO",
  };

  if (Array.isArray(tasksStore)) {
    tasksStore.push(task);
  }

  return res.status(201).json({
    success: true,
    message: "Task created",
    data: task,
  });
}

export function createTaskRouter(tasksStore = []) {
  const router = Router(nestedRouterOptions);

  router.get("/", (req, res) => {
    const { workspaceId } = req.params;
    const filtered = workspaceId
      ? tasksStore.filter((t) => t.workspaceId === workspaceId)
      : tasksStore;

    return res.status(200).json({
      success: true,
      message: "Tasks fetched",
      data: filtered,
    });
  });

  router.post("/", (req, res) => createTaskHandler(req, res, tasksStore));

  return router;
}
