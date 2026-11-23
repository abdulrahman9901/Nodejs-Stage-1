import test from "node:test";
import assert from "node:assert/strict";
import { serverConfig } from "../src/config/server-config.js";

test("Base Node.js app config loads defaults cleanly", () => {
  assert.equal(serverConfig.appName, "TaskHub API");
  assert.equal(serverConfig.port, 3000);
  assert.equal(serverConfig.host, "0.0.0.0");
});
