# Student Lab — Session 11: RBAC Guards, IDOR & File Upload Hardening

## Setup
```bash
npm install
```

## Part A: Authentication (`401`) & Role-Based Access Control (`403`) (~20 min)
1. Open `src/middlewares/security-guards.js`.
2. Fix `authorizeRoles(...allowedRoles)` to return `{ allowed: false, statusCode: 401 }` when `!user`, `{ allowed: false, statusCode: 403 }` when `user.role` is not in `allowedRoles`, and `{ allowed: true, statusCode: 200 }` when allowed.
3. Implement the `authenticate(jwtSecret)` Express middleware:
   - Read `req.headers?.authorization`. If it does not start with `"Bearer "`, return status `401`.
   - Verify the token using `verifyJwt(token, jwtSecret)`.
   - Attach `req.user = { id: decoded.sub, role: decoded.role, email: decoded.email }` and call `next()`.
   - Return status `401` if `verifyJwt` throws.

## Part B: Fix the IDOR Ownership Vulnerability (~10 min)
1. In `canDeleteWorkspace(workspace, requestingUser)`, fix the IDOR bug so a manager cannot delete another manager's workspace!
2. Only return `true` when `workspace.ownerId === requestingUser.id` **or** `requestingUser.role === "ADMIN"`.

## Part C: File Upload Hardening (`415`, `413` & Path Traversal) (~15 min)
1. Implement `validateUploadFile({ mimetype, size })`:
   - Allow only `image/png`, `image/jpeg`, `image/webp`, and `application/pdf` (otherwise return `statusCode: 415`, `errorCode: "INVALID_FILE_TYPE"`).
   - Reject files larger than `5 * 1024 * 1024` bytes (5MB) with `statusCode: 413`, `errorCode: "LIMIT_FILE_SIZE"`.
2. Fix `buildSafeUploadFilename(originalName)` so `../../.env.png` cannot escape the upload folder — extract only `path.extname(originalName).toLowerCase()` and prepend `${Date.now()}-${crypto.randomUUID()}`.

## Verify
Run `npm test` — all 5 security tests must pass!
