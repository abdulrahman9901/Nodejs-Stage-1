import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { getPrismaSingleton } from "../src/config/prisma-singleton.js";
import { PrismaWorkspaceRepository } from "../src/modules/workspaces/workspace.prisma-repo.js";
import { WorkspaceService } from "../src/modules/workspaces/workspace.service.js";
import { createApp } from "../src/app.js";

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
        const doc = { id: `65f1a9c0e4b0a1d2c3f4e50${items.length + 1}`, ...data };
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
  const created = await repo.create({ name: "DevOps", ownerId: "65f1a9c0e4b0a1d2c3f4e5a6" });
  assert.equal(created.name, "DevOps");

  const foundByName = await repo.findByName("DevOps");
  assert.equal(foundByName.id, created.id);

  const service = new WorkspaceService(repo);
  const serviceWs = await service.createWorkspace({ name: "Analytics", ownerId: "65f1a9c0e4b0a1d2c3f4e5a6" });
  assert.equal(serviceWs.name, "Analytics");

  const deleted = await repo.deleteById(created.id);
  assert.equal(deleted, true);
  assert.equal(await repo.deleteById("non_existent"), false);

  // Verify Express app wiring works with injected PrismaWorkspaceRepository
  const app = createApp({ workspaceRepo: repo });
  const server = await new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  try {
    const res = await fetch(`http://127.0.0.1:${server.address().port}/api/v1/workspaces`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.data.length, 1);
    assert.equal(body.data[0].name, "Analytics");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
