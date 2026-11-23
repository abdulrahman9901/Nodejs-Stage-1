import net from "node:net";

const server = net.createServer((socket) => {
  socket.setKeepAlive(true, 30_000);
  socket.on("error", (err) => console.warn("[Socket Error]:", err.code));
  console.log(
    `[4-TUPLE] Client ${socket.remoteAddress}:${socket.remotePort} <--> Server ${socket.localAddress}:${socket.localPort}`
  );
  socket.end("HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: 21\r\n\r\nTCP 4-Tuple Connected");
});

if (process.argv[1]?.endsWith("tcp-4tuple-demo.js")) {
  server.listen(3000, "0.0.0.0", () => console.log("[TCP] Listening on 0.0.0.0:3000"));
}
