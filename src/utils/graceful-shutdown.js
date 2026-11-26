/**
 * TODO(student): Implement production SIGTERM / SIGINT graceful shutdown:
 * 1. Guard with an `isShuttingDown` boolean so duplicate signals return `{ executed: false, signal }`
 * 2. Close the HTTP server first (`await new Promise((resolve, reject) => server.close(...))`)
 * 3. Only after HTTP drains, disconnect the database pool (`await prisma.$disconnect()`)
 * 4. Return `{ executed: true, signal }`
 */
export function createGracefulShutdown({ server, prisma }) {
  return async function shutdown(signal = "SIGTERM") {
    return { executed: false, signal };
  };
}
