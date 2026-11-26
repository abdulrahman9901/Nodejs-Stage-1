import express from "express";
import { AppError } from "./utils/app-error.js";
import { createTaskSchema, validate } from "./middlewares/validate.js";
import { globalErrorHandler } from "./middlewares/error-handler.js";

export function createApp() {
  const app = express();
  const tasks = [];

  app.use(express.json());

  app.post("/api/v1/workspaces/:workspaceId/tasks", validate(createTaskSchema), (req, res, next) => {
    const { workspaceId } = req.params;
    const { title, priority, status } = req.body;

    // Simulate Prisma P2002 unique constraint if same title exists in same workspace
    const duplicate = tasks.some(
      (t) => t.workspaceId === workspaceId && t.title.toLowerCase() === title.toLowerCase()
    );
    if (duplicate) {
      const prismaErr = new Error("Unique constraint failed on the fields: (`workspaceId`,`title`)");
      prismaErr.code = "P2002";
      return next(prismaErr);
    }

    const created = {
      id: `task_${tasks.length + 1}`,
      workspaceId,
      title,
      priority,
      status,
    };
    tasks.push(created);

    return res.status(201).json({
      success: true,
      message: "Task created",
      data: created,
    });
  });

  app.use((req, _res, next) => {
    return next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404, "NOT_FOUND"));
  });

  app.use(globalErrorHandler);

  return app;
}
