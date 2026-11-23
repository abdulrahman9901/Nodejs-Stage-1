import test from "node:test";
import assert from "node:assert/strict";
import {
  extractTimestampFromObjectId,
  chooseModelingPattern,
  buildEsrCompoundIndex,
} from "../src/db/mongodb-modeling.js";

test("S07: Extracts accurate Date from first 4 bytes (8 hex chars) of ObjectId", () => {
  const dt = extractTimestampFromObjectId("65f1a9c0e4b0a1d2c3f4e5a6");
  assert.equal(dt.toISOString(), "2024-03-13T13:27:28.000Z");
  assert.throws(() => extractTimestampFromObjectId("not-an-id"));
});

test("S07: Chooses REFERENCE for unbounded Workspace->Tasks and EMBED for small settings", () => {
  assert.equal(chooseModelingPattern({ isUnbounded: true, sharedAcrossParents: false }), "REFERENCE");
  assert.equal(chooseModelingPattern({ isUnbounded: false, sharedAcrossParents: false }), "EMBED");
});

test("S07: ESR Compound Index orders Equality -> Sort -> Range", () => {
  const fields = buildEsrCompoundIndex({
    equalityFields: ["workspaceId", "status"],
    sortFields: ["createdAt"],
    rangeFields: ["priority"],
  });
  assert.deepEqual(fields, ["workspaceId", "status", "createdAt", "priority"]);
});
