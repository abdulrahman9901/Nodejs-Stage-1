import http from "node:http";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";
import { serverConfig } from "../config/server-config.js";
import { AuditEventBus, getUtf8ContentLength } from "./primitives.js";

function* generateExportLines(count = 50) {
  for (let i = 1; i <= count; i++) {
    yield JSON.stringify({ id: `task-${i}`, title: `TaskHub Export Item #${i}`, status: "DONE" }) + "\n";
  }
}

export function createStreamServer(auditBus = new AuditEventBus()) {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    // 1. UTF-8 Buffer.byteLength demo (Arabic + Emoji)
    if (req.method === "GET" && url.pathname === "/api/v1/greeting") {
      const body = JSON.stringify({
        success: true,
        message: "مرحبا من TaskHub 🚀",
      });

      auditBus.emit("audit", { action: "GREETING_VIEWED", path: url.pathname });

      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": getUtf8ContentLength(body),
      });
      return res.end(body);
    }

    // 2. Streaming NDJSON export with on-the-fly Gzip via pipeline()
    if (req.method === "GET" && url.pathname === "/api/v1/export") {
      const acceptEncoding = String(req.headers["accept-encoding"] || "");
      const wantsGzip = acceptEncoding.includes("gzip");
      const source = Readable.from(generateExportLines(50));

      auditBus.emit("audit", { action: "EXPORT_STREAMED", compressed: wantsGzip });

      try {
        if (wantsGzip) {
          res.writeHead(200, {
            "Content-Type": "application/x-ndjson; charset=utf-8",
            "Content-Encoding": "gzip",
          });
          await pipeline(source, createGzip(), res);
        } else {
          res.writeHead(200, {
            "Content-Type": "application/x-ndjson; charset=utf-8",
          });
          await pipeline(source, res);
        }
      } catch (err) {
        auditBus.emit("error", err);
        if (!res.headersSent) {
          res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
        }
        res.end();
      }
      return;
    }

    // 3. Inspect recorded EventEmitter audit logs
    if (req.method === "GET" && url.pathname === "/api/v1/audit") {
      const body = JSON.stringify({
        success: true,
        count: auditBus.logs.length,
        logs: auditBus.logs,
      });
      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": getUtf8ContentLength(body),
      });
      return res.end(body);
    }

    const notFound = JSON.stringify({ success: false, message: `Route ${req.method} ${url.pathname} not found` });
    res.writeHead(404, {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Length": getUtf8ContentLength(notFound),
    });
    return res.end(notFound);
  });
}

const isDirectRun =
  process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"));
if (isDirectRun) {
  const server = createStreamServer();
  server.listen(serverConfig.port, serverConfig.host, () => {
    console.log(`[S04] Raw HTTP stream server listening on http://${serverConfig.host}:${serverConfig.port}`);
    console.log("      GET /api/v1/greeting  (UTF-8 Content-Length)");
    console.log("      GET /api/v1/export    (NDJSON stream + Gzip via pipeline)");
    console.log("      GET /api/v1/audit     (EventEmitter audit log)");
  });
}
