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

test("S10: Salted password hashes differ for same password and verify accurately", () => {
  const h1 = hashPassword("Secret123!");
  const h2 = hashPassword("Secret123!");
  assert.notEqual(h1, h2, "Unique random salt must produce different hashes");
  assert.equal(h1.includes("Secret123!"), false);
  assert.equal(verifyPassword("Secret123!", h1), true);
  assert.equal(verifyPassword("WrongPass!", h1), false);
});

test("S10: JWT signs, verifies, and rejects tampered or expired tokens", () => {
  const secret = "super_strong_256bit_course_secret";
  const token = signJwt({ sub: "user_1", role: "MEMBER" }, secret, 300);
  const decoded = verifyJwt(token, secret);
  assert.equal(decoded.sub, "user_1");
  assert.equal(decoded.role, "MEMBER");

  // 1. Tamper payload: change MEMBER -> ADMIN without knowing secret!
  const [h, , s] = token.split(".");
  const fakePayload = Buffer.from(JSON.stringify({ sub: "user_1", role: "ADMIN" })).toString("base64url");
  assert.throws(() => verifyJwt(`${h}.${fakePayload}.${s}`, secret), /INVALID_SIGNATURE/);

  // 2. Truncated signature must not throw an unhandled RangeError
  assert.throws(() => verifyJwt(`${h}.${fakePayload}.short`, secret), /INVALID_SIGNATURE/);

  // 3. Expired token (-10s) must throw TOKEN_EXPIRED
  const expiredToken = signJwt({ sub: "user_1" }, secret, -10);
  assert.throws(() => verifyJwt(expiredToken, secret), /TOKEN_EXPIRED/);
});

test("S10: sanitizeUserDto strips passwordHash completely", () => {
  const dto = sanitizeUserDto({ id: "1", email: "a@b.com", passwordHash: "salt:hash" });
  assert.equal("passwordHash" in dto, false);
});

test("S10: Auth endpoints hash passwords, strip DTOs, issue JWTs, and prevent User Enumeration", async () => {
  const app = createApp();
  const server = await new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 1. Register user -> 201 without passwordHash
    const regRes = await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "sara@taskhub.dev", name: "Sara", password: "Password123!" }),
    });
    assert.equal(regRes.status, 201);
    const regBody = await regRes.json();
    assert.equal(regBody.data.email, "sara@taskhub.dev");
    assert.equal("passwordHash" in regBody.data, false);

    // 2. User Enumeration Check: unknown email vs wrong password MUST return identical 401 & message
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
    assert.equal(
      unknownBody.message,
      wrongPassBody.message,
      "Login must return identical error message to prevent User Enumeration"
    );

    // 3. Valid login -> 200 with verifiable JWT accessToken
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "sara@taskhub.dev", password: "Password123!" }),
    });
    assert.equal(loginRes.status, 200);
    const loginBody = await loginRes.json();
    assert.ok(loginBody.data.accessToken);
    assert.equal("passwordHash" in loginBody.data.user, false);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
