# Student Lab — Session 11: RBAC, IDOR Fix & File Upload Hardening

## Tasks in `src/middlewares/security-guards.js`
1. Fix `authorizeRoles(...allowedRoles)` to return `401` when `user` is null and `403` when `user.role` is not allowed.
2. Fix the IDOR vulnerability in `canDeleteWorkspace()` so only the workspace owner (`workspace.ownerId === requestingUser.id`) OR a global `ADMIN` can delete it!
3. Implement `validateUploadFile()` enforcing MIME whitelist (`image/png`, `image/jpeg`, `image/webp`, `application/pdf` -> 415) and 5MB cap (-> 413).
4. Fix Path Traversal in `buildSafeUploadFilename()` using `crypto.randomUUID()` + `path.extname()`.
5. Run `npm test`.
