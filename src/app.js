import express from "express";
import { runPaginatedQuery } from "./modules/tasks/query-engine.js";

const SEED_TASKS = Array.from({ length: 25 }, (_, i) => ({
  id: `task_${i + 1}`,
  title: `Task #${String(i + 1).padStart(2, "0")}`,
  priority: (i % 5) + 1,
  status: i % 2 === 0 ? "TODO" : "DONE",
  createdAt: new Date(Date.UTC(2026, 0, i + 1)).toISOString(),
}));

export function createApp(initialTasks = SEED_TASKS) {
  const app = express();
  const tasks = initialTasks.map((t) => ({ ...t }));

  app.use(express.json());

  app.get("/api/v1/tasks", async (req, res, next) => {
    try {
      const statusFilter = req.query.status;
      const filtered = statusFilter
        ? tasks.filter((t) => t.status === statusFilter)
        : tasks;

      const result = await runPaginatedQuery(
        async ({ skip, take, sortBy, order }) => {
          const sorted = [...filtered].sort((a, b) => {
            if (a[sortBy] < b[sortBy]) return order === "asc" ? -1 : 1;
            if (a[sortBy] > b[sortBy]) return order === "asc" ? 1 : -1;
            return 0;
          });
          return sorted.slice(skip, skip + take);
        },
        async () => filtered.length,
        req.query
      );

      return res.status(200).json({
        success: true,
        message: "Tasks fetched",
        data: result.items,
        meta: result.meta,
      });
    } catch (err) {
      return next(err);
    }
  });

  return app;
}
