export function loadValidatedEnv(source = process.env) {
  // TODO(student): Validate DATABASE_URL and JWT_SECRET are present (fail fast!)
  return {
    port: source.PORT !== undefined ? Number(source.PORT) : 3000,
    // TODO(student): Bug! Using || overwrites 0 with 5000! Fix it and Object.freeze() the result.
    timeoutMs: Number(source.TIMEOUT_MS) || 5000,
    databaseUrl: source.DATABASE_URL,
    jwtSecret: source.JWT_SECRET,
  };
}
