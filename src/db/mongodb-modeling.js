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

export function buildEsrCompoundIndex({ equalityFields, sortFields, rangeFields }) {
  return [...equalityFields, ...sortFields, ...rangeFields];
}
