import { createApp } from "./app.js";
import { serverConfig } from "./config/server-config.js";

const isDirectRun =
  process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"));

if (isDirectRun) {
  const app = createApp();
  app.listen(serverConfig.port, serverConfig.host, () => {
    console.log(
      `[BOOT] ${serverConfig.appName} (Prisma + MongoDB) listening on http://${serverConfig.host}:${serverConfig.port}`
    );
  });
}
