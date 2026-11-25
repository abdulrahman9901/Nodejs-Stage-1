import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { getPrismaSingleton } from "../src/config/prisma-singleton.js";
import { PrismaWorkspaceRepository } from "../src/modules/workspaces/workspace.prisma-repo.js";
import { WorkspaceService } from "../src/modules/workspaces/workspace.service.js";

test("S08: schema.prisma configures MongoDB ObjectId mapping, Cascade delete, and ESR @@index", () => {
  const schema = fs.readFileSync("prisma/schema.prisma", "utf-8");
  assert.match(schema, /provider\s*=\s*"mongodb"/);
  assert.match(schema, /@map\("_id"\)\s+@db\.ObjectId/);
  assert.match(schema, /onDelete:\s*Cascade/);
  assert.match(schema, /@@index\(\[workspaceId,\s*status,\s*createdAt\(sort:\s*Desc\)\s*\]\)/);
  assert.match(schema, /model User/);
  assert.match(schema, /model Workspace/);
  assert.match(schema, /model Task/);
});

test("S08: getPrismaSingleton reuses the exact same instance across hot reloads", () => {
  let count = 0;
  const fakeGlobal = {};
  const c1 = getPrismaSingleton(() => ({ id: ++count }), fakeGlobal);
  const c2 = getPrismaSingleton(() => ({ id: ++count }), fakeGlobal);
  assert.equal(c1, c2);
  assert.equal(count, 1, "Factory must only be called once when cached on globalThis");
});

test("S08: PrismaWorkspaceRepository translates CRUD calls to Prisma client delegates", async () => {
  const items = [];
  const fakePrisma = {
    workspace: {
      async findMany() {
        return items;
      },
      async findUnique({ where }) {
        return items.find((i) => i.id === where.id) || null;
      },
      async findFirst({ where }) {
        return items.find((i) => i.name === where.name) || null;
      },
      async create({ data }) {
        const doc = { id: `ws_${items.length + 1}`, ...data };
        items.push(doc);
        return doc;
      },
      async delete({ where }) {
        const idx = items.findIndex((i) => i.id === where.id);
        if (idx === -1) throw new Error("Record to delete does not exist.");
        items.splice(idx, 1);
        return true;
      },
    },
  };

  const repo = new PrismaWorkspaceRepository(fakePrisma);

  // 1. Create
  const created = await repo.create({ name: "DevOps", ownerId: "u_1" });
  assert.equal(created.name, "DevOps");
  assert.equal(created.id, "ws_1");

  // 2. FindByName & FindById
  const foundByName = await repo.findByName("DevOps");
  assert.equal(foundByName.id, "ws_1");

  const foundById = await repo.findById("ws_1");
  assert.equal(foundById.name, "DevOps");

  // 3. Clean Architecture Integration: Plug PrismaWorkspaceRepository into WorkspaceService from S06!
  const service = new WorkspaceService(repo);
  const serviceWs = await service.createWorkspace({ name: "Analytics", ownerId: "u_2" });
  assert.equal(serviceWs.name, "Analytics");
  assert.equal("internalFlag" in serviceWs, false, "WorkspaceService must still sanitize DTO cleanly with Prisma repo");

  // 4. Delete
  const deleted = await repo.deleteById("ws_1");
  assert.equal(deleted, true);
  const deleteMissing = await repo.deleteById("non_existent");
  assert.equal(deleteMissing, false);
});
