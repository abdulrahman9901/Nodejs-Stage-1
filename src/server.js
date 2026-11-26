import { createApp } from "./app.js";
import { serverConfig } from "./config/server-config.js";
import { createGracefulShutdown } from "./utils/graceful-shutdown.js";

const isDirectRun =
  process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"));

if (isDirectRun) {
  const app = createApp();

  // `app.listen(...)` returns the running Node `http.Server` instance
  const server = app.listen(serverConfig.port, serverConfig.host, () => {
    console.log(
      `[BOOT] ${serverConfig.appName} (Express) listening on http://${serverConfig.host}:${serverConfig.port}`
    );
  });

  // Step 1: Pass `server` and `prisma` into createGracefulShutdown.
  //         It returns a `shutdown` function that remembers them via closure!
  const shutdown = createGracefulShutdown({ server, prisma: null });

  // Step 2: Tell Node.js to call `shutdown` whenever the OS asks the app to stop:
  process.on("SIGTERM", () => shutdown("SIGTERM")); // Sent by Docker / Kubernetes / Cloud on deploy
  process.on("SIGINT", () => shutdown("SIGINT"));   // Sent when you press Ctrl + C in the terminal
}
