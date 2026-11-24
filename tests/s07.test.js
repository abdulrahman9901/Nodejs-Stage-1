import test from "node:test";
import assert from "node:assert/strict";
import {
  extractTimestampFromObjectId,
  chooseModelingPattern,
  buildEsrCompoundIndex,
  buildMongoIndexSpec,
  refactorEmbeddedWorkspaceToReferenced,
} from "../src/db/mongodb-modeling.js";
import { simulateQueryPlan } from "../src/db/query-plan-demo.js";

test("S07: Extracts accurate Date from first 4 bytes (8 hex chars) of ObjectId", () => {
  const dt = extractTimestampFromObjectId("65f1a9c0e4b0a1d2c3f4e5a6");
  assert.equal(dt.toISOString(), "2024-03-13T13:27:28.000Z");
  assert.throws(() => extractTimestampFromObjectId("not-an-id"));
});

test("S07: Chooses REFERENCE for unbounded or shared relations, EMBED for bounded sub-docs", () => {
  assert.equal(chooseModelingPattern({ isUnbounded: true, sharedAcrossParents: false }), "REFERENCE");
  assert.equal(chooseModelingPattern({ isUnbounded: false, sharedAcrossParents: true }), "REFERENCE");
  assert.equal(chooseModelingPattern({ isUnbounded: false, sharedAcrossParents: false }), "EMBED");
});

test("S07: ESR Compound Index and Mongo createIndex spec order Equality -> Sort -> Range", () => {
  const fields = buildEsrCompoundIndex({
    equalityFields: ["workspaceId", "status"],
    sortFields: ["createdAt"],
    rangeFields: ["priority"],
  });
  assert.deepEqual(fields, ["workspaceId", "status", "createdAt", "priority"]);

  const spec = buildMongoIndexSpec({
    equalityFields: ["workspaceId", "status"],
    sortFields: [{ field: "createdAt", direction: -1 }],
    rangeFields: ["priority"],
  });
  assert.deepEqual(Object.keys(spec), ["workspaceId", "status", "createdAt", "priority"]);
  assert.deepEqual(spec, { workspaceId: 1, status: 1, createdAt: -1, priority: 1 });
});

test("S07: refactorEmbeddedWorkspaceToReferenced splits unbounded tasks while keeping settings embedded", () => {
  const badDoc = {
    _id: "65f1a9c0e4b0a1d2c3f4e5a6",
    name: "Engineering",
    settings: { theme: "dark", maxMembers: 25 },
    tasks: [
      { _id: "t1", title: "Design schema" },
      { _id: "t2", title: "Add ESR index" },
    ],
  };

  const { workspace, tasks } = refactorEmbeddedWorkspaceToReferenced(badDoc);
  assert.equal("tasks" in workspace, false, "Unbounded tasks array must be removed from workspace");
  assert.deepEqual(workspace.settings, { theme: "dark", maxMembers: 25 });
  assert.equal(tasks.length, 2);
  assert.equal(tasks[0].workspaceId, badDoc._id);
  assert.equal(tasks[1].workspaceId, badDoc._id);
});

test("S07: simulateQueryPlan proves ESR left-prefix IXSCAN beats COLLSCAN", () => {
  const docs = Array.from({ length: 100 }, (_, i) => ({
    _id: `t${i}`,
    workspaceId: i < 5 ? "ws_1" : "ws_2",
    status: "TODO",
  }));

  const collscan = simulateQueryPlan(docs, { workspaceId: "ws_1", status: "TODO" }, []);
  assert.equal(collscan.stage, "COLLSCAN");
  assert.equal(collscan.totalDocsExamined, 100);

  const ixscan = simulateQueryPlan(
    docs,
    { workspaceId: "ws_1", status: "TODO" },
    ["workspaceId", "status", "createdAt"]
  );
  assert.equal(ixscan.stage, "IXSCAN");
  assert.equal(ixscan.totalDocsExamined, 5);
});
