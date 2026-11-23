# Instructor Explain Guide — Session 11: RBAC Guards, IDOR & Upload Hardening

## Live Demos
1. `authorizeRoles('ADMIN', 'MANAGER')` returning `403` (not `401`!).
2. `canDeleteWorkspace(workspace, user)` stopping IDOR attacks between two managers.
3. `buildSafeUploadFilename` & `validateUploadFile` defeating `../../.env` Path Traversal, `.exe` uploads (415), and > 5MB DoS (413).
4. Run `npm test`.
