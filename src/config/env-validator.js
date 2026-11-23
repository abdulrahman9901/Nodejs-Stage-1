export function loadValidatedEnv(source = process.env) {
  const required = ["DATABASE_URL", "JWT_SECRET"];
  const missing = required.filter((key) => !source[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  return Object.freeze({
    port: source.PORT !== undefined ? Number(source.PORT) : 3000,
    timeoutMs: source.TIMEOUT_MS !== undefined ? Number(source.TIMEOUT_MS) : 5000,
    databaseUrl: source.DATABASE_URL,
    jwtSecret: source.JWT_SECRET,
  });
}
