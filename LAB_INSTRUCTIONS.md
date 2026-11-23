# Student Lab — Session 6: Clean Architecture, DI & DTO Sanitization

## Tasks
1. Open `src/modules/workspaces/workspace.service.js`.
2. Accept `workspaceRepo` in `constructor(workspaceRepo)` (Constructor Dependency Injection).
3. In `createWorkspace({ name, ownerId })`:
   - Reject names shorter than 3 characters with an Error having `err.statusCode = 422`.
   - Check `this.workspaceRepo.findByName(cleanName)` and throw an Error with `err.statusCode = 409` if duplicate.
   - Strip `internalFlag` from the returned DTO!
4. Run `npm test`.
