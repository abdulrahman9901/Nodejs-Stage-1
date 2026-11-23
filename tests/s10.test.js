import test from "node:test";
import assert from "node:assert/strict";
import {
  hashPassword,
  verifyPassword,
  signJwt,
  verifyJwt,
  sanitizeUserDto,
} from "../src/modules/auth/crypto-auth.js";

test("S10: Salted password hashes differ for same password and verify accurately", () => {
  const h1 = hashPassword("Secret123!");
  const h2 = hashPassword("Secret123!");
  assert.notEqual(h1, h2, "Unique random salt must produce different hashes");
  assert.equal(h1.includes("Secret123!"), false);
  assert.equal(verifyPassword("Secret123!", h1), true);
  assert.equal(verifyPassword("WrongPass!", h1), false);
});

test("S10: JWT signs, verifies, and rejects tampered payload", () => {
  const secret = "super_strong_256bit_course_secret";
  const token = signJwt({ sub: "user_1", role: "MEMBER" }, secret, 300);
  const decoded = verifyJwt(token, secret);
  assert.equal(decoded.sub, "user_1");
  assert.equal(decoded.role, "MEMBER");

  const [h, , s] = token.split(".");
  const fakePayload = Buffer.from(JSON.stringify({ sub: "user_1", role: "ADMIN" })).toString("base64url");
  assert.throws(() => verifyJwt(`${h}.${fakePayload}.${s}`, secret));
});

test("S10: sanitizeUserDto strips passwordHash completely", () => {
  const dto = sanitizeUserDto({ id: "1", email: "a@b.com", passwordHash: "salt:hash" });
  assert.equal("passwordHash" in dto, false);
});
