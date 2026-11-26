import { createApp } from "./app.js";
import { serverConfig } from "./config/server-config.js";
import { createGracefulShutdown } from "./utils/graceful-shutdown.js";

const isDirectRun =
  process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"));

if (isDirectRun) {
  const app = createApp();
  const server = app.listen(serverConfig.port, serverConfig.host, () => {
    console.log(
      `[BOOT] ${serverConfig.appName} (Express) listening on http://${serverConfig.host}:${serverConfig.port}`
    );
  });

  // 1. Create the shutdown handler bound to our live HTTP server (and Prisma client if present)
  const shutdown = createGracefulShutdown({ server, prisma: null });

  // 2. Listen for OS termination signals (Docker/K8s sends SIGTERM; Ctrl+C sends SIGINT)
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}
