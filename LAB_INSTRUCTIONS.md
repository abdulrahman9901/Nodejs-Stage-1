# Student Lab — Session 4: Buffers, EventEmitter & Stream Pipelines

## Tasks
1. Open `src/core/primitives.js`.
2. Fix `getUtf8ContentLength(text)` — right now it uses `text.length`, which breaks Content-Length for Arabic text and emojis! Use `Buffer.byteLength`.
3. Wire the `"audit"` event listener inside `AuditEventBus` constructor so emitted events are pushed into `this.logs`.
4. Implement `compressTextWithPipeline(inputText)` using `pipeline()` and `createGzip()`.
5. Run `npm test`.
