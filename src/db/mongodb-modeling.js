export function extractTimestampFromObjectId(hexId) {
  // TODO(student): Validate 24-hex ObjectId and parse bytes 0..3 (first 8 hex chars) as Unix seconds
  return new Date(0);
}

export function chooseModelingPattern({ isUnbounded, sharedAcrossParents }) {
  // TODO(student): Prevent the 16MB unbounded array crash and shared-entity duplication!
  return "EMBED";
}

export function buildEsrCompoundIndex({ equalityFields = [], sortFields = [], rangeFields = [] }) {
  // TODO(student): Fix wrong order! Must be Equality -> Sort -> Range (ESR)
  return [...rangeFields, ...sortFields, ...equalityFields];
}

export function buildMongoIndexSpec({ equalityFields = [], sortFields = [], rangeFields = [] }) {
  // TODO(student): Return a MongoDB createIndex() key object in strict ESR order:
  // - equalityFields: direction 1
  // - sortFields: string (direction 1) OR { field, direction } (default 1)
  // - rangeFields: direction 1
  return {};
}

export function refactorEmbeddedWorkspaceToReferenced(badWorkspaceDoc) {
  // TODO(student):
  // - Remove unbounded `tasks` array from `workspace` (keep bounded `settings` embedded!)
  // - Return { workspace, tasks } where every task has `workspaceId: badWorkspaceDoc._id`
  return { workspace: badWorkspaceDoc, tasks: [] };
}
