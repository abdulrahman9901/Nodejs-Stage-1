# Student Lab — Session 4: Buffers, EventEmitter, Streams & Raw HTTP

## Part A: Fix the Core Node.js Primitives (~20 min)
1. Open `src/core/primitives.js`.
2. **UTF-8 Buffer Length:** Fix `getUtf8ContentLength(text)` — right now it uses `text.length`, which truncates Arabic text and emojis in HTTP `Content-Length`! Use `Buffer.byteLength(text, "utf-8")`.
3. **EventEmitter + Safe Error Handling:** Inside `AuditEventBus`:
   - Listen for `"audit"` events and push `{ timestamp: new Date().toISOString(), ...entry }` into `this.logs`.
   - Attach a safe `"error"` listener that records `err instanceof Error ? err.message : String(err)` into `this.errors` so emitting `"error"` never crashes Node.js.
4. **Stream Pipeline:** Implement `compressTextWithPipeline(inputText)` using `pipeline()` and `createGzip()`.
5. Run `npm test` — all 5 tests must pass!

---

## Part B: Test Your Primitives in a Live Raw HTTP Streaming Server (~15–20 min)
Once `npm test` passes, start the raw `node:http` streaming server that uses your `primitives.js`:
```bash
node src/core/raw-http-stream.js
```

Test all 3 endpoints using `curl` or Postman:
1. **UTF-8 Content-Length (Arabic + Emoji):**
   ```bash
   curl -i http://localhost:3000/api/v1/greeting
   ```
   Confirm the full message `"مرحبا من TaskHub 🚀"` arrives intact and `Content-Length` matches UTF-8 bytes.
2. **On-the-fly Gzip NDJSON Stream:**
   ```bash
   curl -i -H "Accept-Encoding: gzip" --compressed http://localhost:3000/api/v1/export
   ```
   Confirm `Content-Encoding: gzip` is in the response headers and all 50 NDJSON lines stream cleanly.
3. **EventEmitter Audit Trail:**
   ```bash
   curl http://localhost:3000/api/v1/audit
   ```
   Confirm both `GREETING_VIEWED` and `EXPORT_STREAMED` were recorded by `AuditEventBus`.
