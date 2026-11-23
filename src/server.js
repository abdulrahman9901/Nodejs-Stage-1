import http from "node:http";
import { serverConfig } from "./config/server-config.js";

export function createBaseServer() {
  return http.createServer((req, res) => {
    if (req.url === "/" || req.url === "/api/v1/health") {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      return res.end(
        JSON.stringify({
          success: true,
          message: `${serverConfig.appName} base server is running`,
          data: {
            status: "UP",
            version: serverConfig.version,
            env: serverConfig.env,
          },
        })
      );
    }

    res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    return res.end(
      JSON.stringify({
        success: false,
        message: `Route ${req.method} ${req.url} not found`,
      })
    );
  });
}

// Only bind socket when run directly (allows tests to import without port conflicts)
const isDirectRun = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"));
if (isDirectRun) {
  const server = createBaseServer();
  server.listen(serverConfig.port, serverConfig.host, () => {
    console.log(`[BOOT] ${serverConfig.appName} listening on http://${serverConfig.host}:${serverConfig.port}`);
  });
}
