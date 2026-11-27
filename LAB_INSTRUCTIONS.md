# Student Lab — Session 8: Prisma ORM, Local MongoDB & Repositories

## Setup
```bash
npm install
```

## Part A: Prisma MongoDB Schema Directives (~20 min)
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

## Part B: Singleton Connection Pooling (~10 min)
1. Open `src/config/prisma-singleton.js`.
2. Fix `getPrismaSingleton(factory, globalStore = globalThis)` so it checks `globalStore.__prismaClient`.
3. If not yet initialized, call `factory()` and store the instance on `globalStore.__prismaClient`.
4. Return `globalStore.__prismaClient`. This prevents creating a new connection pool on every `node --watch` reload!

---

## Part C: Implement `PrismaWorkspaceRepository` (~20 min)
1. Open `src/modules/workspaces/workspace.prisma-repo.js`.
2. Implement the repository methods using the Prisma Client delegates:
   - `findAll()` → `this.prisma.workspace.findMany({ orderBy: { createdAt: "desc" } })`
   - `findById(id)` → `this.prisma.workspace.findUnique({ where: { id } })`
   - `findByName(name)` → `this.prisma.workspace.findFirst({ where: { name } })`
   - `create(data)` → `this.prisma.workspace.create({ data: { name: data.name, ownerId: data.ownerId } })`
   - `deleteById(id)` → wrap `this.prisma.workspace.delete({ where: { id } })` in `try / catch`, returning `true` on success and `false` if Prisma throws.
3. Run `npm test` — all 4 unit & integration tests must pass!

---

## Part D: Wire & Run Against a Real Local MongoDB Database (~25 min)
> **Important:** Prisma requires MongoDB to run as a **Replica Set** (`?replicaSet=rs0`) because Prisma uses transactions for writes.

### Step 1: Start Local MongoDB as a Replica Set
Choose **one** of these two options:

#### Option 1 — Using Docker (Recommended, 1 command)
```bash
docker compose up -d
```
*(This starts `mongo:7` on port `27017` and automatically initializes replica set `rs0`.)*

#### Option 2 — Native MongoDB Installed Locally (No Docker)
1. Create a data folder (e.g. `mkdir data/db`) and start `mongod` with `--replSet rs0`:
   ```bash
   mongod --replSet rs0 --dbpath ./data/db
   ```
2. In a second terminal, initialize the replica set **once**:
   ```bash
   mongosh --eval "rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: '127.0.0.1:27017' }] })"
   ```

### Step 2: Create `.env` and Push Your Schema
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env   # PowerShell: Copy-Item .env.example .env
   ```
   *(Make sure `DATABASE_URL="mongodb://127.0.0.1:27017/taskhub_db?replicaSet=rs0"` is set.)*
2. Generate the Prisma Client, push your schema & indexes to MongoDB, and seed initial data:
   ```bash
   npm run prisma:generate
   npm run prisma:push
   npm run db:seed
   ```
   *(Copy the `User.id` printed by `db:seed` — you'll use it as `ownerId` when creating workspaces!)*

### Step 3: Test Live & Inspect the Database
1. Start the Express + Prisma server:
   ```bash
   npm run dev
   ```
2. In Postman, hit:
   - `GET http://localhost:3000/api/v1/workspaces` (returns `"Engineering"` from real MongoDB!)
   - `POST http://localhost:3000/api/v1/workspaces` with `{ "name": "Design", "ownerId": "<USER_ID_FROM_SEED>" }`
3. Open **Prisma Studio** (`npm run prisma:studio`) or **MongoDB Compass** (`mongodb://127.0.0.1:27017/?replicaSet=rs0`) and confirm your documents persist in the `workspaces` collection even after restarting the server!
