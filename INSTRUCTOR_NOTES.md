# Instructor Explain Guide — Session 6: 3-Tier Clean Architecture & DI

## Setup
```bash
npm install
npm run dev
```

## Live Demos (~1.5h Session Flow)
1. **3-Tier Separation (`src/modules/workspaces/`)**:
   - **Repository (`workspace.repository.js`)**: Data persistence only — zero HTTP, zero business rules.
   - **Service (`workspace.service.js`)**: Business rules (`422` length, `409` duplicate, `404` missing), Constructor DI (`constructor(workspaceRepo)`), and DTO sanitization (`internalFlag` stripped).
   - **Controller (`workspace.controller.js`)**: Thin HTTP adapter — reads `req.body`/`req.params`, calls Service, sends JSON envelope, forwards errors to `next(err)`.
   - **Routes (`workspace.routes.js`)**: Composition root wiring `Repository -> Service -> Controller`.
2. **Why Constructor DI Matters (`tests/s06.test.js`)**:
   - Show Test 1 unit-testing `WorkspaceService` with a 6-line `fakeRepo` in < 1ms without Express or a database!
3. **Live API Check**: Run `npm run dev` and hit `GET/POST/DELETE /api/v1/workspaces` in Postman, then run `npm test`.
