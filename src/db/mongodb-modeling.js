export function extractTimestampFromObjectId(hexId) {
  if (!/^[0-9a-fA-F]{24}$/.test(hexId)) {
    throw new Error("Invalid 24-hex MongoDB ObjectId");
  }
  const seconds = parseInt(hexId.slice(0, 8), 16);
  return new Date(seconds * 1000);
}

export function chooseModelingPattern({ isUnbounded, sharedAcrossParents }) {
  if (isUnbounded || sharedAcrossParents) return "REFERENCE";
  return "EMBED";
}

export function buildEsrCompoundIndex({ equalityFields = [], sortFields = [], rangeFields = [] }) {
  return [...equalityFields, ...sortFields, ...rangeFields];
}

/**
 * Builds a MongoDB createIndex() key specification object in strict ESR order.
 * - equalityFields: string[] (direction 1)
 * - sortFields: Array<string | { field: string, direction?: 1 | -1 }>
 * - rangeFields: string[] (direction 1)
 */
export function buildMongoIndexSpec({ equalityFields = [], sortFields = [], rangeFields = [] }) {
  const spec = {};
  for (const field of equalityFields) {
    spec[field] = 1;
  }
  for (const entry of sortFields) {
    if (typeof entry === "string") {
      spec[entry] = 1;
    } else {
      spec[entry.field] = entry.direction ?? 1;
    }
  }
  for (const field of rangeFields) {
    spec[field] = 1;
  }
  return spec;
}

/**
 * Refactors a 16MB-risk embedded workspace document into normalized collections:
 * - Keeps bounded `settings` embedded inside `workspace`
 * - Extracts unbounded `tasks` into a separate array with `workspaceId` reference
 */
export function refactorEmbeddedWorkspaceToReferenced(badWorkspaceDoc) {
  const { tasks = [], ...workspace } = badWorkspaceDoc;
  const normalizedTasks = tasks.map((task) => ({
    ...task,
    workspaceId: badWorkspaceDoc._id,
  }));
  return { workspace, tasks: normalizedTasks };
}
