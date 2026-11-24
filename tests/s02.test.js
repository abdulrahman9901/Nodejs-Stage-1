import test from "node:test";
import assert from "node:assert/strict";
import { okEnvelope, errorEnvelope, getStatusForAction } from "../src/http/envelope.js";
import { createContractServer } from "../src/http/contract-server.js";

test("S02: okEnvelope follows standard enterprise JSON contract", () => {
  const res = okEnvelope("Workspace created", { id: "1" });
  assert.deepEqual(res, { success: true, message: "Workspace created", data: { id: "1" } });
});

test("S02: errorEnvelope includes errorCode and optional errors array", () => {
  const withErrors = errorEnvelope("VALIDATION_ERROR", "Invalid input", [
    { field: "name", message: "Required" },
  ]);
  assert.equal(withErrors.success, false);
  assert.equal(withErrors.errorCode, "VALIDATION_ERROR");
  assert.equal(withErrors.errors.length, 1);

  const withoutErrors = errorEnvelope("NOT_FOUND", "Workspace not found");
  assert.deepEqual(withoutErrors, {
    success: false,
    errorCode: "NOT_FOUND",
    message: "Workspace not found",
  });
});

test("S02: REST status code mapping matches HTTP specification", () => {
  assert.equal(getStatusForAction("READ"), 200);
  assert.equal(getStatusForAction("CREATE"), 201);
  assert.equal(getStatusForAction("DELETE"), 204);
  assert.equal(getStatusForAction("BAD_JSON"), 400);
  assert.equal(getStatusForAction("UNAUTHENTICATED"), 401);
  assert.equal(getStatusForAction("FORBIDDEN"), 403);
  assert.equal(getStatusForAction("NOT_FOUND"), 404);
  assert.equal(getStatusForAction("CONFLICT"), 409);
  assert.equal(getStatusForAction("VALIDATION_ERROR"), 422);
  assert.equal(getStatusForAction("UNKNOWN_ACTION"), 500);
});

test("S02: contract-server serves 200, 201, 422, 400, 409, 204, and 404 with standard envelopes", async () => {
  const server = createContractServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 1. GET /api/v1/workspaces -> 200
    const listRes = await fetch(`${baseUrl}/api/v1/workspaces`);
    assert.equal(listRes.status, 200);
    const listBody = await listRes.json();
    assert.equal(listBody.success, true);
    assert.equal(listBody.data.length, 2);

    // 2. POST valid workspace -> 201
    const createRes = await fetch(`${baseUrl}/api/v1/workspaces`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Product" }),
    });
    assert.equal(createRes.status, 201);
    const createBody = await createRes.json();
    assert.equal(createBody.success, true);
    assert.equal(createBody.data.name, "Product");
    const createdId = createBody.data.id;

    // 3. POST invalid workspace -> 422
    const invalidRes = await fetch(`${baseUrl}/api/v1/workspaces`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "" }),
    });
    assert.equal(invalidRes.status, 422);
    const invalidBody = await invalidRes.json();
    assert.equal(invalidBody.success, false);
    assert.equal(invalidBody.errorCode, "VALIDATION_ERROR");
    assert.ok(Array.isArray(invalidBody.errors) && invalidBody.errors.length === 1);

    // 4. POST malformed JSON -> 400
    const badJsonRes = await fetch(`${baseUrl}/api/v1/workspaces`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{ \"name\": \"Broken\"",
    });
    assert.equal(badJsonRes.status, 400);
    const badJsonBody = await badJsonRes.json();
    assert.equal(badJsonBody.success, false);
    assert.equal(badJsonBody.errorCode, "BAD_JSON");

    // 5. POST duplicate workspace -> 409
    const conflictRes = await fetch(`${baseUrl}/api/v1/workspaces`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Engineering" }),
    });
    assert.equal(conflictRes.status, 409);
    const conflictBody = await conflictRes.json();
    assert.equal(conflictBody.success, false);
    assert.equal(conflictBody.errorCode, "CONFLICT");

    // 6. DELETE created workspace -> 204 No Content
    const deleteRes = await fetch(`${baseUrl}/api/v1/workspaces/${createdId}`, {
      method: "DELETE",
    });
    assert.equal(deleteRes.status, 204);
    assert.equal(await deleteRes.text(), "");

    // 7. DELETE non-existent workspace -> 404 Not Found
    const notFoundRes = await fetch(`${baseUrl}/api/v1/workspaces/does-not-exist`, {
      method: "DELETE",
    });
    assert.equal(notFoundRes.status, 404);
    const notFoundBody = await notFoundRes.json();
    assert.equal(notFoundBody.success, false);
    assert.equal(notFoundBody.errorCode, "NOT_FOUND");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
