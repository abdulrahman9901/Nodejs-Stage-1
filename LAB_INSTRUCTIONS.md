# Student Lab — Session 10: Password Hashing, JWTs & User Enumeration Defense

## Setup
```bash
npm install
```

## Part A: Fix Password Hashing, JWT Verification & DTO Leaks (~20 min)
1. Open `src/modules/auth/crypto-auth.js`.
2. **`hashPassword(plainPassword)`**: Generate a 16-byte random hex salt and derive a 64-byte key with `crypto.scryptSync(plainPassword, salt, 64)`, returning `"${salt}:${derived}"`.
3. **`verifyPassword(plainPassword, storedHash)`**: Split the stored salt and hash, re-derive the key with `crypto.scryptSync`, verify matching byte lengths, and compare with `crypto.timingSafeEqual`.
4. **`verifyJwt(token, secret)`**:
   - Recompute the expected HMAC-SHA256 signature (`base64url`) over `"${header}.${body}"`.
   - Reject mismatched or different-length signatures by throwing `new Error("INVALID_SIGNATURE")`.
   - Decode the payload and reject expired tokens (`decoded.exp < Math.floor(Date.now() / 1000)`) by throwing `new Error("TOKEN_EXPIRED")`.
5. **`sanitizeUserDto(user)`**: Strip `passwordHash` before returning the user object.

## Part B: Fix the User Enumeration Vulnerability (~15 min)
1. Open `src/modules/auth/auth.service.js` and inspect `login({ email, password })`.
2. Right now, it returns `404 "User with that email does not exist"` for unknown emails and `401 "Incorrect password for this account"` for wrong passwords — allowing attackers to enumerate registered emails!
3. Fix `login()` so **both** missing user and wrong password throw `statusCode = 401` (`errorCode = "INVALID_CREDENTIALS"`) with the exact same message: `"Invalid email or password"`.

## Part C: Verify (~10 min)
1. Run `npm test` — all 5 security tests must pass!
2. Run `npm run dev` and test `POST /api/v1/auth/register` and `POST /api/v1/auth/login` in Postman.
