import http from "node:http";
import test from "node:test";
import assert from "node:assert/strict";
import {
  getUtf8ContentLength,
  AuditEventBus,
  compressTextWithPipeline,
  decompressBuffer,
} from "../src/core/primitives.js";
import { createStreamServer } from "../src/core/raw-http-stream.js";

function rawHttpGet(port, path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: "127.0.0.1", port, path, method: "GET", headers }, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () =>
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(chunks),
        })
      );
    });
    req.on("error", reject);
    req.end();
  });
}

test("S04: getUtf8ContentLength measures UTF-8 bytes accurately for Arabic/Emoji", () => {
  assert.equal(getUtf8ContentLength("مرحبا"), 10);
  assert.equal(getUtf8ContentLength("🚀"), 4);
});

test("S04: AuditEventBus captures audit events and safely handles error events", () => {
  const bus = new AuditEventBus();
  bus.emit("audit", { action: "TASK_CREATED", id: "1" });
  assert.equal(bus.logs.length, 1);
  assert.equal(bus.logs[0].action, "TASK_CREATED");

  // Must NOT throw an unhandled EventEmitter error
  assert.doesNotThrow(() => bus.emit("error", new Error("Disk full")));
  assert.equal(bus.errors.length, 1);
  assert.equal(bus.errors[0], "Disk full");
});

test("S04: pipeline Gzip round-trip compresses and restores text cleanly", async () => {
  const raw = "TaskHub audit log line ".repeat(50);
  const gz = await compressTextWithPipeline(raw);
  assert.ok(gz.length < Buffer.byteLength(raw), "Compressed buffer should be smaller than raw text");
  const restored = await decompressBuffer(gz);
  assert.equal(restored, raw);
});

test("S04: raw-http-stream serves UTF-8 greeting, Gzipped NDJSON export, and records audit events", async () => {
  const bus = new AuditEventBus();
  const server = createStreamServer(bus);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();

  try {
    // 1. UTF-8 Arabic + Emoji response must not be truncated
    const greetingRes = await rawHttpGet(port, "/api/v1/greeting");
    assert.equal(greetingRes.statusCode, 200);
    const parsed = JSON.parse(greetingRes.body.toString("utf-8"));
    assert.equal(parsed.message, "مرحبا من TaskHub 🚀");
    assert.equal(Number(greetingRes.headers["content-length"]), greetingRes.body.length);

    // 2. Streaming Gzip export via pipeline()
    const exportRes = await rawHttpGet(port, "/api/v1/export", { "Accept-Encoding": "gzip" });
    assert.equal(exportRes.statusCode, 200);
    assert.equal(exportRes.headers["content-encoding"], "gzip");
    const unzipped = await decompressBuffer(exportRes.body);
    assert.ok(unzipped.includes("TaskHub Export Item #50"));

    // 3. AuditEventBus captured both HTTP events
    assert.equal(bus.logs.length, 2);
    assert.equal(bus.logs[0].action, "GREETING_VIEWED");
    assert.equal(bus.logs[1].action, "EXPORT_STREAMED");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
