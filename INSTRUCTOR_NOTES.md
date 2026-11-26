# Instructor Explain Guide — Session 10: Password Hashing, JWTs & User Enumeration Defense

## Setup
```bash
npm install
npm run dev
```

## Live Demos (~1.5h Session Flow)
1. **Salted Password Hashing (`src/modules/auth/crypto-auth.js`)**:
   - Show why a unique 16-byte random salt + `crypto.scryptSync` produces a different hash every time even for the exact same password (defeating rainbow tables).
   - Explain constant-time `crypto.timingSafeEqual` (and checking buffer lengths first!).
2. **RFC 7519 JWT Signing & Tamper Detection (`signJwt` & `verifyJwt`)**:
   - Walk through `header.payload.signature` (`base64url` + HMAC-SHA256).
   - Show how modifying the payload (`role: "MEMBER"` → `"ADMIN"`) breaks the HMAC signature check, and how `exp` enforces short-lived tokens.
3. **User Enumeration Defense & DTO Sanitization (`src/modules/auth/auth.service.js`)**:
   - Show why returning `404 "Email not found"` vs `401 "Wrong password"` lets attackers harvest registered emails, and how returning a single `401 "Invalid email or password"` fixes it.
   - Test `POST /api/v1/auth/register` and `POST /api/v1/auth/login` live in Postman.
4. **Verify**: Run `npm test` (5/5 tests pass).
