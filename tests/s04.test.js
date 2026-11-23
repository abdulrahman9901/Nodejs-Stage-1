import test from "node:test";
import assert from "node:assert/strict";
import {
  getUtf8ContentLength,
  AuditEventBus,
  compressTextWithPipeline,
  decompressBuffer,
} from "../src/core/primitives.js";

test("S04: getUtf8ContentLength measures UTF-8 bytes accurately for Arabic/Emoji", () => {
  assert.equal(getUtf8ContentLength("مرحبا"), 10);
  assert.equal(getUtf8ContentLength("🚀"), 4);
});

test("S04: AuditEventBus captures emitted audit events", () => {
  const bus = new AuditEventBus();
  bus.emit("audit", { action: "TASK_CREATED", id: "1" });
  assert.equal(bus.logs.length, 1);
  assert.equal(bus.logs[0].action, "TASK_CREATED");
});

test("S04: pipeline Gzip round-trip compresses and restores text cleanly", async () => {
  const raw = "TaskHub audit log line ".repeat(50);
  const gz = await compressTextWithPipeline(raw);
  assert.ok(gz.length < Buffer.byteLength(raw), "Compressed buffer should be smaller than raw text");
  const restored = await decompressBuffer(gz);
  assert.equal(restored, raw);
});
