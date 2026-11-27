import net from "node:net";

/**
 * TODO(student): Extract the TCP 4-Tuple from `socket`:
 * Return `{ clientIp: socket.remoteAddress, clientPort: socket.remotePort, serverIp: socket.localAddress, serverPort: socket.localPort }`
 */
export function extractTcp4Tuple(_socket) {
  return { clientIp: "", clientPort: 0, serverIp: "", serverPort: 0 };
}

export function createTcp4TupleServer() {
  return net.createServer((socket) => {
    socket.setKeepAlive(true, 30_000);
    socket.on("error", (err) => console.warn("[Socket Error]:", err.code));

    const tuple = extractTcp4Tuple(socket);
    console.log(
      `[4-TUPLE] Client ${tuple.clientIp}:${tuple.clientPort} <--> Server ${tuple.serverIp}:${tuple.serverPort}`
    );

    socket.end(
      "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: 21\r\n\r\nTCP 4-Tuple Connected"
    );
  });
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"))) {
  const server = createTcp4TupleServer();
  server.listen(3000, "0.0.0.0", () => console.log("[TCP] Listening on 0.0.0.0:3000"));
}
