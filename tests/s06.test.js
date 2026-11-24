import test from "node:test";
import assert from "node:assert/strict";
import { WorkspaceRepository } from "../src/modules/workspaces/workspace.repository.js";
import { WorkspaceService } from "../src/modules/workspaces/workspace.service.js";
import { createApp } from "../src/app.js";

test("S06: WorkspaceService works with an injected mock repository (pure DI unit test)", async () => {
  const fakeRepo = {
    async findByName() {
      return null;
    },
    async create(data) {
      return { id: "mock_1", ...data, internalFlag: true };
    },
  };

  const service = new WorkspaceService(fakeRepo);
  const dto = await service.createWorkspace({ name: "  Mock Team  ", ownerId: "u1" });
  assert.equal(dto.id, "mock_1");
  assert.equal(dto.name, "Mock Team");
  assert.equal("internalFlag" in dto, false, "DTO must strip internalFlag");
});

test("S06: WorkspaceService enforces 3-char rule (422), duplicate check (409), and 404 lookup", async () => {
  const service = new WorkspaceService(new WorkspaceRepository());

  await assert.rejects(
    () => service.createWorkspace({ name: "ab", ownerId: "u1" }),
    (err) => err.statusCode === 422
  );

  const ws = await service.createWorkspace({ name: "Engineering", ownerId: "u1" });
  assert.equal(ws.name, "Engineering");
  assert.equal("internalFlag" in ws, false, "DTO must strip internalFlag");

  await assert.rejects(
    () => service.createWorkspace({ name: "Engineering", ownerId: "u1" }),
    (err) => err.statusCode === 409
  );

  await assert.rejects(
    () => service.getWorkspaceById("ws_missing"),
    (err) => err.statusCode === 404
  );
});

test("S06: 3-Tier Express HTTP flow (Controller -> Service -> Repository) serves CRUD cleanly", async () => {
  const app = createApp();
  const server = await new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 1. POST valid workspace -> 201 + DTO sanitized
    const createRes = await fetch(`${baseUrl}/api/v1/workspaces`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Platform", ownerId: "u1" }),
    });
    assert.equal(createRes.status, 201);
    const createBody = await createRes.json();
    assert.equal(createBody.success, true);
    assert.equal(createBody.data.name, "Platform");
    assert.equal("internalFlag" in createBody.data, false);
    const createdId = createBody.data.id;

    // 2. POST duplicate -> 409
    const dupRes = await fetch(`${baseUrl}/api/v1/workspaces`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Platform", ownerId: "u1" }),
    });
    assert.equal(dupRes.status, 409);

    // 3. GET list -> 200 with sanitized DTOs
    const listRes = await fetch(`${baseUrl}/api/v1/workspaces`);
    assert.equal(listRes.status, 200);
    const listBody = await listRes.json();
    assert.equal(listBody.data.length, 1);
    assert.equal("internalFlag" in listBody.data[0], false);

    // 4. DELETE created workspace -> 204
    const delRes = await fetch(`${baseUrl}/api/v1/workspaces/${createdId}`, { method: "DELETE" });
    assert.equal(delRes.status, 204);

    // 5. GET deleted workspace -> 404
    const missingRes = await fetch(`${baseUrl}/api/v1/workspaces/${createdId}`);
    assert.equal(missingRes.status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
