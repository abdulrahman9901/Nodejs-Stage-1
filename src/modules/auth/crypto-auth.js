import crypto from "node:crypto";

export function hashPassword(plainPassword) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(plainPassword, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(plainPassword, storedHash) {
  const [salt, keyHex] = String(storedHash || "").split(":");
  if (!salt || !keyHex) return false;
  const keyBuf = Buffer.from(keyHex, "hex");
  const derivedBuf = crypto.scryptSync(plainPassword, salt, 64);
  if (keyBuf.length !== derivedBuf.length) return false;
  return crypto.timingSafeEqual(keyBuf, derivedBuf);
}

export function signJwt(payload, secret, expiresInSeconds = 900) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const body = Buffer.from(
    JSON.stringify({ ...payload, iat: now, exp: now + expiresInSeconds })
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

export function verifyJwt(token, secret) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) throw new Error("INVALID_TOKEN");
  const [header, body, sig] = parts;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${body}`)
    .digest("base64url");

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    throw new Error("INVALID_SIGNATURE");
  }

  const decoded = JSON.parse(Buffer.from(body, "base64url").toString("utf-8"));
  if (decoded.exp !== undefined && decoded.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("TOKEN_EXPIRED");
  }
  return decoded;
}

export function sanitizeUserDto({ passwordHash, ...safeUser }) {
  return safeUser;
}
