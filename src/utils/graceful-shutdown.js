/**
 * Production SIGTERM / SIGINT graceful shutdown orchestrator:
 * 1. Ignores duplicate termination signals while already shutting down
 * 2. Stops accepting new HTTP connections & drains in-flight requests (server.close)
 * 3. Closes the database connection pool cleanly (prisma.$disconnect)
 */
export function createGracefulShutdown({ server, prisma }) {
  let isShuttingDown = false;

  return async function shutdown(signal = "SIGTERM") {
    if (isShuttingDown) {
      return { executed: false, signal };
    }
    isShuttingDown = true;

    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });

    if (prisma && typeof prisma.$disconnect === "function") {
      await prisma.$disconnect();
    }

    return { executed: true, signal };
  };
}
