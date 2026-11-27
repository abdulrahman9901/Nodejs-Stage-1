import test from "node:test";
import assert from "node:assert/strict";
import {
  hashPassword,
  verifyPassword,
  signJwt,
  verifyJwt,
  sanitizeUserDto,
} from "../src/modules/auth/crypto-auth.js";
import { createApp } from "../src/app.js";

test("S10: Salted async scrypt password hashes differ for same password and verify accurately", async () => {
  const h1 = await hashPassword("Secret123!");
  const h2 = await hashPassword("Secret123!");
  assert.notEqual(h1, h2, "Unique random salt must produce different hashes");
  assert.equal(h1.includes("Secret123!"), false);
  assert.equal(await verifyPassword("Secret123!", h1), true);
  assert.equal(await verifyPassword("WrongPass!", h1), false);
});

test("S10: JWT signs, verifies, and rejects tampered or expired tokens", () => {
  const secret = "super_strong_256bit_course_secret";
  const token = signJwt({ sub: "user_1", role: "MEMBER" }, secret, 300);
  const decoded = verifyJwt(token, secret);
  assert.equal(decoded.sub, "user_1");
  assert.equal(decoded.role, "MEMBER");

  const [h, , s] = token.split(".");
  const fakePayload = Buffer.from(JSON.stringify({ sub: "user_1", role: "ADMIN" })).toString("base64url");
  assert.throws(() => verifyJwt(`${h}.${fakePayload}.${s}`, secret), /INVALID_SIGNATURE/);
  assert.throws(() => verifyJwt(`${h}.${fakePayload}.short`, secret), /INVALID_SIGNATURE/);

  const expiredToken = signJwt({ sub: "user_1" }, secret, -10);
  assert.throws(() => verifyJwt(expiredToken, secret), /TOKEN_EXPIRED/);
});

test("S10: sanitizeUserDto strips passwordHash completely", () => {
  const dto = sanitizeUserDto({ id: "1", email: "a@b.com", passwordHash: "salt:hash" });
  assert.equal("passwordHash" in dto, false);
});

test("S10: Auth endpoints hash passwords, strip DTOs, issue JWTs, serve /auth/me, and prevent User Enumeration", async () => {
  const app = createApp();
  const server = await new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    const regRes = await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "sara@taskhub.dev", name: "Sara", password: "Password123!" }),
    });
    assert.equal(regRes.status, 201);
    const regBody = await regRes.json();
    assert.equal(regBody.data.email, "sara@taskhub.dev");
    assert.equal("passwordHash" in regBody.data, false);

    const unknownEmailRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "nobody@taskhub.dev", password: "Password123!" }),
    });
    const wrongPassRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "sara@taskhub.dev", password: "WrongPassword!" }),
    });
    assert.equal(unknownEmailRes.status, 401);
    assert.equal(wrongPassRes.status, 401);
    const unknownBody = await unknownEmailRes.json();
    const wrongPassBody = await wrongPassRes.json();
    assert.equal(unknownBody.message, wrongPassBody.message);

    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "sara@taskhub.dev", password: "Password123!" }),
    });
    assert.equal(loginRes.status, 200);
    const loginBody = await loginRes.json();
    assert.ok(loginBody.data.accessToken);
    assert.equal("passwordHash" in loginBody.data.user, false);

    const unauthMe = await fetch(`${baseUrl}/api/v1/auth/me`);
    assert.equal(unauthMe.status, 401);

    const meRes = await fetch(`${baseUrl}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${loginBody.data.accessToken}` },
    });
    assert.equal(meRes.status, 200);
    const meBody = await meRes.json();
    assert.equal(meBody.data.email, "sara@taskhub.dev");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
