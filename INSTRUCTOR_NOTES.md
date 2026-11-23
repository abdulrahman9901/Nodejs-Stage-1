# Instructor Explain Guide — Session 6: 3-Tier Clean Architecture & DI

## Live Demos
1. Walk through `src/modules/workspaces/`: Repository -> Service (Constructor DI, zero `req`/`res`) -> DTO Sanitization.
2. Show how `tests/s06.test.js` unit-tests `WorkspaceService` with a mock repository in < 1ms without Express or a database!
3. Run `npm test`.
