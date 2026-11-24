# Student Lab — Session 7: MongoDB ObjectId, Modeling & ESR Indexes

## Part A: ObjectId Anatomy & Embedding vs. Referencing (~15 min)
1. Open `src/db/mongodb-modeling.js`.
2. Implement `extractTimestampFromObjectId(hexId)`:
   - Reject any string that is not a valid 24-character hexadecimal ObjectId.
   - Decode the first 4 bytes (first 8 hex characters) as Unix seconds and return the corresponding `Date`.
3. Fix `chooseModelingPattern({ isUnbounded, sharedAcrossParents })` so unbounded or shared relations return `"REFERENCE"` and bounded private sub-documents return `"EMBED"`.
4. Implement `refactorEmbeddedWorkspaceToReferenced(badWorkspaceDoc)`:
   - Split out the unbounded `tasks` array so the workspace document stays safely under MongoDB's 16MB limit, while keeping bounded `settings` embedded.
   - Attach `workspaceId: badWorkspaceDoc._id` to every extracted task and return `{ workspace, tasks }`.

## Part B: ESR Compound Indexes & Query Plans (~20 min)
1. Fix `buildEsrCompoundIndex()` to order fields by MongoDB's **ESR Rule** (Equality → Sort → Range).
2. Implement `buildMongoIndexSpec()` to return a real MongoDB `createIndex()` key specification object (e.g. `{ workspaceId: 1, status: 1, createdAt: -1, priority: 1 }`) preserving strict ESR key order.
3. Run the query plan simulator and inspect the difference between `COLLSCAN` and `IXSCAN`:
   ```bash
   node src/db/query-plan-demo.js
   ```

## Verify
Run `npm test` — all 6 tests must pass!
