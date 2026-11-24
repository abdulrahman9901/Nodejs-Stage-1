# Instructor Explain Guide — Session 7: MongoDB Modeling, ObjectId & ESR Indexes

## Live Demos (~1.5h Session Flow)
1. **12-Byte ObjectId Anatomy (`src/db/mongodb-modeling.js`)**:
   - Break down Bytes 0–3 (Unix timestamp), Bytes 4–8 (random), Bytes 9–11 (counter) and show `extractTimestampFromObjectId()`.
2. **Embedding vs. Referencing & 16MB BSON Limit**:
   - Walk through `chooseModelingPattern()` and `refactorEmbeddedWorkspaceToReferenced()` — keeping bounded `settings` embedded while extracting unbounded `tasks` into a referenced collection with `workspaceId`.
3. **ESR Compound Index Rule & `COLLSCAN` vs `IXSCAN`**:
   - Run `node src/db/query-plan-demo.js` live to show 10,000 docs examined (`COLLSCAN` / wrong index order) vs ~67 docs examined (`IXSCAN` with ESR index `{ workspaceId: 1, status: 1, createdAt: -1, priority: 1 }`).
4. **Verify**: Run `npm test` (6/6 tests pass).
