# Instructor Explain Guide — Session 10: Salted Password Hashing & JWT Internals

## Live Demos
1. `src/modules/auth/crypto-auth.js` — Salted `node:crypto` `scrypt` hashing + constant-time `timingSafeEqual`, plus RFC 7519 HMAC-SHA256 JWT signing & verification (zero external dependencies needed to understand the exact cryptography!).
2. User Enumeration defense (identical 401 message) & DTO passwordHash stripping.
3. Run `npm test`.
