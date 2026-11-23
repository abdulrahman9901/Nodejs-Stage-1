import test from "node:test";
import assert from "node:assert/strict";
import { okEnvelope, errorEnvelope, getStatusForAction } from "../src/http/envelope.js";

test("S02: okEnvelope follows standard enterprise JSON contract", () => {
  const res = okEnvelope("Workspace created", { id: "1" });
  assert.deepEqual(res, { success: true, message: "Workspace created", data: { id: "1" } });
});

test("S02: errorEnvelope includes errorCode and optional errors array", () => {
  const res = errorEnvelope("VALIDATION_ERROR", "Invalid input", [{ field: "name", message: "Required" }]);
  assert.equal(res.success, false);
  assert.equal(res.errorCode, "VALIDATION_ERROR");
  assert.equal(res.errors.length, 1);
});

test("S02: REST status code mapping matches HTTP specification", () => {
  assert.equal(getStatusForAction("CREATE"), 201);
  assert.equal(getStatusForAction("DELETE"), 204);
  assert.equal(getStatusForAction("UNAUTHENTICATED"), 401);
  assert.equal(getStatusForAction("FORBIDDEN"), 403);
  assert.equal(getStatusForAction("CONFLICT"), 409);
  assert.equal(getStatusForAction("VALIDATION_ERROR"), 422);
});
