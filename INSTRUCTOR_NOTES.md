# Instructor Explain Guide — Session 11: RBAC Guards, IDOR & Upload Hardening

## Setup
```bash
npm install
npm run dev
```

## Live Demos (~1.5h Session Flow)
1. **Authentication vs. Authorization (`401` vs `403`)**:
   - Walk through `authenticate(jwtSecret)` (`401` missing/invalid Bearer JWT) vs `authorizeRoles('ADMIN', 'MANAGER')` (`403` authenticated user lacks role).
2. **IDOR (Insecure Direct Object Reference) Defense**:
   - Show why RBAC alone isn't enough: Manager B has role `MANAGER`, so they pass `authorizeRoles('ADMIN', 'MANAGER')` — without `canDeleteWorkspace(workspace, req.user)`, Manager B can delete Manager A's workspace!
3. **File Upload Hardening**:
   - Walk through `validateUploadFile()` (MIME whitelist `415` defeating `.exe` uploads, 5MB cap `413` defeating disk/memory DoS) and `buildSafeUploadFilename()` (UUID + `path.extname` defeating `../../.env` Path Traversal).
4. **Verify**: Run `npm test` (5/5 tests pass).
