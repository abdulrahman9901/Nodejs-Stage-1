# Student Lab — Session 8: Prisma MongoDB Schema & Singleton Pooling

## Tasks
1. Open `prisma/schema.prisma`:
   - Fix the primary key directives to include `@map("_id") @db.ObjectId`.
   - Add `onDelete: Cascade` on the `Task.workspace` relation.
   - Add `@@index([workspaceId, status, createdAt(sort: Desc)])` to `model Task`.
2. Open `src/config/prisma-singleton.js` and cache the created client on `globalStore.__prismaClient` so calling `getPrismaSingleton()` twice only invokes `factory()` ONCE!
3. Run `npm test`.
