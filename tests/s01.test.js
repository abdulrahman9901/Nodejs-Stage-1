import test from "node:test";
import assert from "node:assert/strict";
import { getBindingConfig, listIPv4Interfaces } from "../src/scripts/network-preflight.js";

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
