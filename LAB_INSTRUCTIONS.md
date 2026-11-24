# Student Lab — Session 6: 3-Tier Clean Architecture, DI & DTOs

## Setup
```bash
npm install
```

## Part A: Implement the Service Layer & DTO Sanitization (~20 min)
1. Open `src/modules/workspaces/workspace.service.js` (notice `workspaceRepo` is injected via `constructor(workspaceRepo)` — zero Express `req`/`res` here!).
2. Implement `sanitize(workspace)` to strip `internalFlag` before returning any DTO.
3. Implement `listWorkspaces()`, `getWorkspaceById(id)` (`404` when missing), and `deleteWorkspace(id)` (`404` when missing).
4. Implement `createWorkspace({ name, ownerId })`:
   - Trim `name` and reject `< 3` characters with `err.statusCode = 422`.
   - Check `this.workspaceRepo.findByName(cleanName)` and reject duplicates with `err.statusCode = 409`.
   - Persist via `this.workspaceRepo.create(...)` and return `this.sanitize(created)`.

## Part B: Implement the Thin Controller Layer (~15 min)
1. Open `src/modules/workspaces/workspace.controller.js`.
2. Wire `list` (`200`), `getById` (`200`), `create` (`201`), and `remove` (`204` empty body) to `this.workspaceService`.
3. Keep all business logic out of the controller — catch errors and forward them to `next(err)`.

## Part C: Verify & Test Live (~10 min)
1. Run `npm test` — all 4 tests (including the mock-repo DI unit test and live Express CRUD test) must pass!
2. Run `npm run dev` and test `POST / GET / DELETE http://localhost:3000/api/v1/workspaces` in Postman, verifying `internalFlag` never leaks in responses.
