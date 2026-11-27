import net from "node:net";

/**
 * Extracts the TCP 4-Tuple that uniquely identifies an active socket connection:
 * [Client IP, Client Ephemeral Port, Server IP, Server Listening Port]
 *
 * Even when 10,000 users connect to Server Port 3000 simultaneously, each connection
 * gets a unique Client IP + Client Ephemeral Port so the OS never mixes them up!
 */
export function extractTcp4Tuple(socket) {
  return {
    clientIp: socket.remoteAddress,
    clientPort: socket.remotePort,
    serverIp: socket.localAddress,
    serverPort: socket.localPort,
  };
}

export function createTcp4TupleServer() {
  return net.createServer((socket) => {
    // 1. TCP Keep-Alive: sends heartbeat probes after 30s of idle silence so routers/firewalls
    //    don't silently drop open connections (and cleans up dead peers).
    socket.setKeepAlive(true, 30_000);

    // 2. Socket Error Listener: every Socket is an EventEmitter! Without an "error" listener,
    //    a client abruptly closing their browser tab (ECONNRESET) would crash Node.js.
    socket.on("error", (err) => console.warn("[Socket Error]:", err.code));

    const tuple = extractTcp4Tuple(socket);
    console.log(
      `[4-TUPLE] Client ${tuple.clientIp}:${tuple.clientPort} <--> Server ${tuple.serverIp}:${tuple.serverPort}`
    );

    // 3. HTTP is just plain text over TCP: Status Line + Headers + Blank Line (\r\n\r\n) + Body
    socket.end(
      "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: 21\r\n\r\nTCP 4-Tuple Connected"
    );
  });
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"))) {
  const server = createTcp4TupleServer();
  server.listen(3000, "0.0.0.0", () => console.log("[TCP] Listening on 0.0.0.0:3000"));
}
