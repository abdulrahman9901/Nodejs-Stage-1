# Student Lab — Session 8: Prisma ORM, MongoDB Schemas & Repositories

## Part A: Prisma MongoDB Schema Directives (~25 min)
1. Open `prisma/schema.prisma`.
2. For each model (`User`, `Workspace`, `Task`), fix the primary key `id` attribute:
   ```prisma
   id String @id @default(auto()) @map("_id") @db.ObjectId
   ```
3. In `model Task`, configure **Cascade Delete** on the relation so deleting a workspace cleans up all its tasks:
   ```prisma
   workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
   ```
4. In `model Task`, add the compound index matching MongoDB's **ESR rule**:
   ```prisma
   @@index([workspaceId, status, createdAt(sort: Desc)])
   ```

---

## Part B: Singleton Connection Pooling (~15 min)
1. Open `src/config/prisma-singleton.js`.
2. Fix `getPrismaSingleton(factory, globalStore = globalThis)` so it checks `globalStore.__prismaClient`.
3. If not yet initialized, call `factory()` and store the instance on `globalStore.__prismaClient`.
4. Return `globalStore.__prismaClient`. This prevents creating a new connection pool on every `node --watch` reload!

---

## Part C: Implement `PrismaWorkspaceRepository` (~30 min)
1. Open `src/modules/workspaces/workspace.prisma-repo.js`.
2. Implement the repository methods using the Prisma Client delegates:
   - `findAll()` → `this.prisma.workspace.findMany()`
   - `findById(id)` → `this.prisma.workspace.findUnique({ where: { id } })`
   - `findByName(name)` → `this.prisma.workspace.findFirst({ where: { name } })`
   - `create(data)` → `this.prisma.workspace.create({ data: { name: data.name, ownerId: data.ownerId, internalFlag: true } })`
   - `deleteById(id)` → wraps `this.prisma.workspace.delete({ where: { id } })` in `try / catch`, returning `true` on success and `false` if Prisma throws.
3. Notice how this satisfies the Clean Architecture contract from Session 6 — `WorkspaceService` doesn't know or care whether the database is MongoDB, Postgres, or an in-memory array!

---

## Verify
Run `npm test` — all 4 tests in `tests/s08.test.js` must pass!
