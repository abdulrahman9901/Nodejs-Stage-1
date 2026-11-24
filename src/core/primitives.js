import { EventEmitter } from "node:events";
import { Readable, Writable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createGzip, createGunzip } from "node:zlib";

export function getUtf8ContentLength(text) {
  return Buffer.byteLength(text, "utf-8");
}

export class AuditEventBus extends EventEmitter {
  constructor() {
    super();
    this.logs = [];
    this.errors = [];

    this.on("audit", (entry) => {
      this.logs.push({ timestamp: new Date().toISOString(), ...entry });
    });

    // Safe error listener: prevents unhandled "error" events from crashing Node.js
    this.on("error", (err) => {
      this.errors.push(err instanceof Error ? err.message : String(err));
    });
  }
}

export async function compressTextWithPipeline(inputText) {
  const chunks = [];
  const collect = new Writable({
    write(chunk, _enc, cb) {
      chunks.push(chunk);
      cb();
    },
  });
  await pipeline(Readable.from([inputText]), createGzip(), collect);
  return Buffer.concat(chunks);
}

export async function decompressBuffer(gzBuffer) {
  const chunks = [];
  const collect = new Writable({
    write(chunk, _enc, cb) {
      chunks.push(chunk);
      cb();
    },
  });
  await pipeline(Readable.from([gzBuffer]), createGunzip(), collect);
  return Buffer.concat(chunks).toString("utf-8");
}
