import test from "node:test";
import assert from "node:assert/strict";
import { serverConfig } from "../src/config/server-config.js";

test("Resolved server config keeps port 4000 and maxConnections 100", () => {
  assert.equal(serverConfig.port, 4000);
  assert.equal(serverConfig.maxConnections, 100);
  assert.equal(serverConfig.host, "0.0.0.0");
});
