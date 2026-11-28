export const serverConfig = {
  // --- Common shared baseline configuration ---
  appName: "TaskHub API — Team A Edition",
  version: "1.1.0",
  host: process.env.HOST || "0.0.0.0",
  apiPrefix: "/api/v1",
  timeoutMs: 30000,
  logLevel: "debug",

  // --- Conflicting team modifications ---
  port: Number(process.env.PORT) || 4000,
  env: process.env.NODE_ENV || "development",
};
