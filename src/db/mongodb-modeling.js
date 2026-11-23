export function extractTimestampFromObjectId(hexId) {
  // TODO(student): Validate 24-hex ObjectId and parse bytes 0..3 (first 8 hex chars) as Unix seconds
  return new Date(0);
}

export function chooseModelingPattern({ isUnbounded, sharedAcrossParents }) {
  // TODO(student): Prevent the 16MB unbounded array crash!
  return "EMBED";
}

export function buildEsrCompoundIndex({ equalityFields, sortFields, rangeFields }) {
  // TODO(student): Fix wrong order! Must be Equality -> Sort -> Range (ESR)
  return [...rangeFields, ...sortFields, ...equalityFields];
}
