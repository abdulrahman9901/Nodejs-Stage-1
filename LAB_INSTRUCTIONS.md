# Student Lab — Session 10: Fixing Plaintext Passwords, JWT Tampering & DTO Leaks

## Security Vulnerabilities to Fix in `src/modules/auth/crypto-auth.js`
1. `hashPassword()` currently returns plaintext! Hash with a unique random 16-byte salt + `crypto.scryptSync`.
2. `verifyPassword()` must extract the salt and compare hashes using `crypto.timingSafeEqual`.
3. `verifyJwt()` currently skips signature verification (allowing attackers to forge `role: "ADMIN"`!). Recompute the HMAC-SHA256 signature and reject mismatches & expired tokens!
4. `sanitizeUserDto()` currently leaks `passwordHash`! Strip it before returning.
5. Run `npm test` until every security check passes!
