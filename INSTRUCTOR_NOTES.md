# Instructor Explain Guide — Session 4: Buffers, Streams, EventEmitter & Raw HTTP

## Live Demos (~1.5h Session Flow)
1. **UTF-8 Buffers (`src/core/primitives.js`)**:
   - Show why `"مرحبا".length === 5` vs `Buffer.byteLength("مرحبا", "utf-8") === 10` (and `"🚀"` = `2` vs `4` bytes), and how using `.length` in HTTP `Content-Length` truncates responses.
2. **EventEmitter (`AuditEventBus`)**:
   - Explain pub/sub decoupling and why attaching a safe `this.on("error", ...)` listener prevents unhandled EventEmitter crashes.
3. **Stream `pipeline()` + Raw HTTP (`node src/core/raw-http-stream.js`)**:
   - Start the server and test live:
     - `curl -i http://localhost:3000/api/v1/greeting` (exact UTF-8 `Content-Length`)
     - `curl -i -H "Accept-Encoding: gzip" --compressed http://localhost:3000/api/v1/export` (on-the-fly Gzip NDJSON stream via `pipeline()`)
     - `curl http://localhost:3000/api/v1/audit` (live `AuditEventBus` log)
4. **Verify**: Run `npm test` to confirm all 5 tests pass.
