import test from "node:test";
import assert from "node:assert/strict";
import { WorkspaceRepository } from "../src/modules/workspaces/workspace.repository.js";
import { WorkspaceService } from "../src/modules/workspaces/workspace.service.js";

test("S06: WorkspaceService enforces 3-char rule, duplicate check (409), and DTO sanitization", async () => {
  const service = new WorkspaceService(new WorkspaceRepository());

  await assert.rejects(() => service.createWorkspace({ name: "ab", ownerId: "u1" }), (err) => err.statusCode === 422);

  const ws = await service.createWorkspace({ name: "Engineering", ownerId: "u1" });
  assert.equal(ws.name, "Engineering");
  assert.equal("internalFlag" in ws, false, "DTO must strip internalFlag");

  await assert.rejects(() => service.createWorkspace({ name: "Engineering", ownerId: "u1" }), (err) => err.statusCode === 409);
});
