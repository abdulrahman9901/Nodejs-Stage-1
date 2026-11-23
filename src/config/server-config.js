export const serverConfig = {
  appName: "TaskHub API",
  version: "1.0.0",
  host: process.env.HOST || "0.0.0.0",
  port: Number(process.env.PORT) || 3000,
  env: process.env.NODE_ENV || "development",
};
