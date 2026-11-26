import test from "node:test";
import assert from "node:assert/strict";
import {
  getBindingConfig,
  listIPv4Interfaces,
  resolveDnsPreflight,
} from "../src/scripts/network-preflight.js";
import { extractTcp4Tuple } from "../src/scripts/tcp-4tuple-demo.js";

test("S01: Server binds to 0.0.0.0 by default (container-safe, not 127.0.0.1)", () => {
  const cfg = getBindingConfig({});
  assert.equal(cfg.host, "0.0.0.0");
  assert.equal(cfg.port, 3000);
  assert.equal(cfg.isContainerSafe, true);
});

test("S01: listIPv4Interfaces returns at least loopback 127.0.0.1", () => {
  const list = listIPv4Interfaces();
  assert.ok(list.length > 0, "Expected at least one IPv4 interface");
  assert.ok(list.some((i) => i.address === "127.0.0.1"), "Expected loopback 127.0.0.1");
});

test("S01: resolveDnsPreflight resolves localhost and measures latencyMs", async () => {
  const dnsResult = await resolveDnsPreflight("localhost");
  assert.equal(dnsResult.hostname, "localhost");
  assert.ok(dnsResult.address === "127.0.0.1" || dnsResult.address === "::1");
  assert.equal(typeof dnsResult.latencyMs, "number");
  assert.ok(dnsResult.latencyMs >= 0);
});

test("S01: extractTcp4Tuple returns client and server IP/port 4-tuple from socket", () => {
  const fakeSocket = {
    remoteAddress: "127.0.0.1",
    remotePort: 54321,
    localAddress: "0.0.0.0",
    localPort: 3000,
  };
  assert.deepEqual(extractTcp4Tuple(fakeSocket), {
    clientIp: "127.0.0.1",
    clientPort: 54321,
    serverIp: "0.0.0.0",
    serverPort: 3000,
  });
});
