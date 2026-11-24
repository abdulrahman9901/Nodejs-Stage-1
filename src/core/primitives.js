import { EventEmitter } from "node:events";
import { Readable, Writable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createGzip, createGunzip } from "node:zlib";

export function getUtf8ContentLength(text) {
  // TODO(student): Bug! text.length counts UTF-16 code units, not UTF-8 bytes!
  return text.length;
}

export class AuditEventBus extends EventEmitter {
  constructor() {
    super();
    this.logs = [];
    this.errors = [];
    // TODO(student): Listen for "audit" events and push { timestamp, ...entry } into this.logs
    // TODO(student): Attach a safe "error" listener that pushes err.message (or String(err))
    //                into this.errors so unhandled "error" events never crash Node.js!
  }
}

export async function compressTextWithPipeline(inputText) {
  // TODO(student): Use pipeline(Readable.from([inputText]), createGzip(), collectStream)
  return Buffer.from(inputText);
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
