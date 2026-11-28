export const serverConfig = {
  // --- Common shared baseline configuration ---
  appName: "TaskHub API — Team B Edition",
  version: "1.2.0",
  host: process.env.HOST || "0.0.0.0",
  apiPrefix: "/api/v1",
  timeoutMs: 30000,
  logLevel: "debug",

  // --- Conflicting team modifications ---
  port: Number(process.env.PORT) || 5000,
  maxConnections: 100,
  env: process.env.NODE_ENV || "production",
};
