/**
 * Production SIGTERM / SIGINT graceful shutdown orchestrator (Factory + Closure pattern):
 * - In production (`src/server.js`), receives the real `http.Server` and `prisma` client.
 * - In unit tests (`tests/s12.test.js`), receives lightweight mocks to verify shutdown order.
 */
export function createGracefulShutdown({ server, prisma }) {
  // 1. Private closure lock: tracks whether shutdown has already started
  let isShuttingDown = false;

  // 2. Returns the async handler attached to `process.on("SIGTERM")` & `process.on("SIGINT")`
  return async function shutdown(signal = "SIGTERM") {
    // 3. Guard against duplicate signals (e.g., Ctrl+C pressed twice or repeated SIGTERM):
    //    Exit early so we don't crash trying to close the server or DB twice.
    if (isShuttingDown) {
      return { executed: false, signal };
    }
    isShuttingDown = true;

    // 4. FIRST: Close the HTTP server ("lock the front door") and wait for active
    //    in-flight requests to finish sending their responses.
    //    `server.close(cb)` uses a callback, so we wrap it in a Promise to `await` it.
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });

    // 5. SECOND: Only after every HTTP request is done, close the database pool.
    //    (Closing the DB before HTTP finishes would crash in-flight requests mid-query!)
    if (prisma && typeof prisma.$disconnect === "function") {
      await prisma.$disconnect();
    }

    return { executed: true, signal };
  };
}
