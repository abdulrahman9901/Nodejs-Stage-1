# Instructor Explain Guide — Session 8: Prisma ORM, MongoDB Schemas & Repositories

## Live Demos (~1.5h Session Flow)
1. **Prisma with MongoDB (`prisma/schema.prisma`)**:
   - `datasource db { provider = "mongodb", url = env("DATABASE_URL") }`
   - Primary key mapping for MongoDB: `@id @default(auto()) @map("_id") @db.ObjectId`.
   - Foreign key reference: `ownerId String @db.ObjectId` with `@relation(fields: [ownerId], references: [id])`.
   - Cascade delete: `onDelete: Cascade` on the `Task.workspace` relation (deleting a workspace cleans up tasks).
   - Compound ESR index: `@@index([workspaceId, status, createdAt(sort: Desc)])`.
   - Collections mapping: `@@map("workspaces")`, `@@map("tasks")`, `@@map("users")`.
2. **Connection Pool Management (`src/config/prisma-singleton.js`)**:
   - Explain why `new PrismaClient()` in module scope leaks DB connections during development (`node --watch`).
   - Show how storing on `globalThis.__prismaClient` caches a single pool across hot reloads.
3. **Repository Pattern with Prisma (`src/modules/workspaces/workspace.prisma-repo.js`)**:
   - Show how `WorkspaceService` from Session 6 works seamlessly when switching from an in-memory repository to `PrismaWorkspaceRepository` with zero changes to business logic.
4. **Verify**: Run `npm test` (3/3 test suites pass).
