import test from "node:test";
import assert from "node:assert/strict";
import {
  authorizeRoles,
  canDeleteWorkspace,
  validateUploadFile,
  buildSafeUploadFilename,
} from "../src/middlewares/security-guards.js";

test("S11: authorizeRoles returns 401 if unauthenticated, 403 if wrong role, 200 if allowed", () => {
  const guard = authorizeRoles("ADMIN", "MANAGER");
  assert.equal(guard(null).statusCode, 401);
  assert.equal(guard({ id: "u1", role: "MEMBER" }).statusCode, 403);
  assert.equal(guard({ id: "u2", role: "MANAGER" }).statusCode, 200);
});

test("S11: canDeleteWorkspace prevents IDOR between two non-admin managers", () => {
  const ws = { id: "ws1", ownerId: "user_A" };
  assert.equal(canDeleteWorkspace(ws, { id: "user_B", role: "MANAGER" }), false);
  assert.equal(canDeleteWorkspace(ws, { id: "user_A", role: "MANAGER" }), true);
  assert.equal(canDeleteWorkspace(ws, { id: "user_C", role: "ADMIN" }), true);
});

test("S11: Upload validator enforces MIME whitelist (415), 5MB limit (413) and defeats Path Traversal", () => {
  assert.equal(validateUploadFile({ mimetype: "application/x-msdownload", size: 100 }).statusCode, 415);
  assert.equal(validateUploadFile({ mimetype: "image/png", size: 6 * 1024 * 1024 }).statusCode, 413);
  assert.equal(validateUploadFile({ mimetype: "application/pdf", size: 1024 }).ok, true);

  const safe = buildSafeUploadFilename("../../.env.png");
  assert.equal(safe.includes(".."), false);
  assert.equal(safe.endsWith(".png"), true);
});
