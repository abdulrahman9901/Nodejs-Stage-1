export const serverConfig = {
  appName: "TaskHub API — Team B Edition",
  version: "1.2.0",
  host: process.env.HOST || "0.0.0.0",
  port: Number(process.env.PORT) || 5000,
  maxConnections: 100,
  env: process.env.NODE_ENV || "production",
};
