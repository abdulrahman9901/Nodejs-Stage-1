import http from "node:http";
import crypto from "node:crypto";
import { serverConfig } from "../config/server-config.js";
import { okEnvelope, errorEnvelope, getStatusForAction } from "./envelope.js";

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => resolve(raw));
    req.on("error", reject);
  });
}

const DEFAULT_WORKSPACES = [
  { id: "ws-1", name: "Engineering", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "ws-2", name: "Design", createdAt: "2026-01-02T00:00:00.000Z" },
];

export function createContractServer(initialWorkspaces = DEFAULT_WORKSPACES) {
  const workspaces = initialWorkspaces.map((w) => ({ ...w }));

  return http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const pathname = url.pathname;
    const method = req.method;

    // GET /api/v1/workspaces
    if (method === "GET" && pathname === "/api/v1/workspaces") {
      return sendJson(
        res,
        getStatusForAction("READ"),
        okEnvelope("Workspaces fetched", workspaces)
      );
    }

    // POST /api/v1/workspaces
    if (method === "POST" && pathname === "/api/v1/workspaces") {
      const rawBody = await readRawBody(req);
      let body;
      try {
        body = rawBody ? JSON.parse(rawBody) : {};
      } catch {
        return sendJson(
          res,
          getStatusForAction("BAD_JSON"),
          errorEnvelope("BAD_JSON", "Malformed JSON request body")
        );
      }

      const name = typeof body?.name === "string" ? body.name.trim() : "";
      if (name.length < 2) {
        return sendJson(
          res,
          getStatusForAction("VALIDATION_ERROR"),
          errorEnvelope("VALIDATION_ERROR", "Invalid workspace payload", [
            { field: "name", message: "Name is required and must be at least 2 characters" },
          ])
        );
      }

      const exists = workspaces.some((w) => w.name.toLowerCase() === name.toLowerCase());
      if (exists) {
        return sendJson(
          res,
          getStatusForAction("CONFLICT"),
          errorEnvelope("CONFLICT", `Workspace "${name}" already exists`)
        );
      }

      const created = {
        id: `ws-${crypto.randomUUID().slice(0, 8)}`,
        name,
        createdAt: new Date().toISOString(),
      };
      workspaces.push(created);

      return sendJson(
        res,
        getStatusForAction("CREATE"),
        okEnvelope("Workspace created", created)
      );
    }

    // Match /api/v1/workspaces/:id
    const idMatch = pathname.match(/^\/api\/v1\/workspaces\/([^/]+)$/);
    if (idMatch) {
      const id = decodeURIComponent(idMatch[1]);
      const index = workspaces.findIndex((w) => w.id === id);

      if (method === "GET") {
        if (index === -1) {
          return sendJson(
            res,
            getStatusForAction("NOT_FOUND"),
            errorEnvelope("NOT_FOUND", `Workspace "${id}" not found`)
          );
        }
        return sendJson(
          res,
          getStatusForAction("READ"),
          okEnvelope("Workspace fetched", workspaces[index])
        );
      }

      if (method === "DELETE") {
        if (index === -1) {
          return sendJson(
            res,
            getStatusForAction("NOT_FOUND"),
            errorEnvelope("NOT_FOUND", `Workspace "${id}" not found`)
          );
        }
        workspaces.splice(index, 1);
        res.writeHead(getStatusForAction("DELETE"));
        return res.end();
      }
    }

    return sendJson(
      res,
      getStatusForAction("NOT_FOUND"),
      errorEnvelope("NOT_FOUND", `Route ${method} ${pathname} not found`)
    );
  });
}

const isDirectRun =
  process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"));
if (isDirectRun) {
  const server = createContractServer();
  server.listen(serverConfig.port, serverConfig.host, () => {
    console.log(
      `[S02] Contract server listening on http://${serverConfig.host}:${serverConfig.port}`
    );
    console.log("      GET    /api/v1/workspaces");
    console.log("      GET    /api/v1/workspaces/:id");
    console.log("      POST   /api/v1/workspaces");
    console.log("      DELETE /api/v1/workspaces/:id");
  });
}
