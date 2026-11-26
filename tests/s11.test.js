import test from "node:test";
import assert from "node:assert/strict";
import {
  authorizeRoles,
  canDeleteWorkspace,
  validateUploadFile,
  buildSafeUploadFilename,
} from "../src/middlewares/security-guards.js";
import { signJwt } from "../src/modules/auth/crypto-auth.js";
import { createApp } from "../src/app.js";

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

test("S11: Express pipeline enforces Bearer auth (401), RBAC (403), IDOR (403), and upload rules (415/413/201)", async () => {
  const secret = "taskhub_s11_jwt_secret";
  const app = createApp({ jwtSecret: secret });
  const server = await new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  const memberToken = signJwt({ sub: "user_M", role: "MEMBER" }, secret);
  const managerBToken = signJwt({ sub: "user_B", role: "MANAGER" }, secret);
  const managerAToken = signJwt({ sub: "user_A", role: "MANAGER" }, secret);

  try {
    // 1. Missing Bearer token -> 401
    const noAuthRes = await fetch(`${baseUrl}/api/v1/workspaces/ws_1`, { method: "DELETE" });
    assert.equal(noAuthRes.status, 401);

    // 2. MEMBER role -> 403 FORBIDDEN
    const memberRes = await fetch(`${baseUrl}/api/v1/workspaces/ws_1`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${memberToken}` },
    });
    assert.equal(memberRes.status, 403);

    // 3. Manager B attempting to delete Manager A's workspace (IDOR attack!) -> 403 IDOR_FORBIDDEN
    const idorRes = await fetch(`${baseUrl}/api/v1/workspaces/ws_1`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${managerBToken}` },
    });
    assert.equal(idorRes.status, 403);

    // 4. Manager A deleting their own workspace -> 204
    const ownerRes = await fetch(`${baseUrl}/api/v1/workspaces/ws_1`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${managerAToken}` },
    });
    assert.equal(ownerRes.status, 204);

    // 5. Upload Path Traversal attempt with valid MIME -> 201 with sanitized UUID filename
    const uploadRes = await fetch(`${baseUrl}/api/v1/uploads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${managerAToken}`,
      },
      body: JSON.stringify({
        originalName: "../../.env.png",
        mimetype: "image/png",
        size: 2048,
      }),
    });
    assert.equal(uploadRes.status, 201);
    const uploadBody = await uploadRes.json();
    assert.equal(uploadBody.data.storedFilename.includes(".."), false);
    assert.equal(uploadBody.data.storedFilename.endsWith(".png"), true);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
