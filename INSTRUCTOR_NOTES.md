# Instructor Explain Guide — Session 8: Prisma ORM, Local MongoDB & Repositories

## Local MongoDB Setup (Live in Class)
Prisma requires MongoDB to run as a **Replica Set** (because Prisma uses transactions for writes):

### Option 1: Docker (1 Command)
```bash
docker compose up -d
```

### Option 2: Native Local MongoDB (Without Docker)
1. Start `mongod` with `--replSet rs0`:
   ```bash
   mongod --replSet rs0 --dbpath ./data/db
   ```
2. Initialize the replica set once in `mongosh`:
   ```bash
   mongosh --eval "rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: '127.0.0.1:27017' }] })"
   ```

### Wire `.env`, Push Schema & Seed
```bash
cp .env.example .env
npm run prisma:generate
npm run prisma:push
npm run db:seed
npm run dev
```
Open Prisma Studio (`npm run prisma:studio`) or MongoDB Compass to inspect the live `users` and `workspaces` collections!

## Live Demos (~1.5h Session Flow)
1. Walk through `prisma/schema.prisma` (`@map("_id") @db.ObjectId`, `onDelete: Cascade`, `@@index`, `@@map`).
2. Explain `src/config/prisma-singleton.js` (`globalThis.__prismaClient` prevents socket pool leaks during `node --watch`).
3. Show `src/modules/workspaces/workspace.prisma-repo.js` plugging into `WorkspaceService` and Express (`src/app.js`) with zero business-logic changes.
4. Run `npm test` (4/4 unit & Express integration tests pass without needing MongoDB running).
