import crypto from "node:crypto";

export function hashPassword(plainPassword) {
  // TODO(student): SECURITY BUG! Never store plaintext passwords! Use random salt + scryptSync.
  return plainPassword;
}

export function verifyPassword(plainPassword, storedHash) {
  // TODO(student): Compare derived key using crypto.timingSafeEqual
  return plainPassword === storedHash;
}

export function signJwt(payload, secret, expiresInSeconds = 900) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const body = Buffer.from(JSON.stringify({ ...payload, iat: now, exp: now + expiresInSeconds })).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

export function verifyJwt(token, secret) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("INVALID_TOKEN");
  // TODO(student): SECURITY BUG! Signature is NOT verified! Recompute HMAC-SHA256 and check expiration!
  return JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
}

export function sanitizeUserDto(user) {
  // TODO(student): SECURITY BUG! Strip passwordHash before returning!
  return user;
}
