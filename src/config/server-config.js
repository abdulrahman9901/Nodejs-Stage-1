export const serverConfig = {
  appName: "TaskHub API — Team A Edition",
  version: "1.1.0",
  host: process.env.HOST || "0.0.0.0",
  port: Number(process.env.PORT) || 4000,
  env: process.env.NODE_ENV || "development",
};
