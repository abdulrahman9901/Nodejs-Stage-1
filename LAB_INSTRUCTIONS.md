# Student Lab — Session 7: MongoDB ObjectId Anatomy & ESR Compound Indexes

## Tasks
1. Open `src/db/mongodb-modeling.js`.
2. Implement `extractTimestampFromObjectId(hexId)`:
   - Validate 24-hex format (`/^[0-9a-fA-F]{24}$/`), throw if invalid.
   - Parse the first 8 hex chars (`parseInt(hexId.slice(0, 8), 16)`) as Unix seconds and return `new Date(seconds * 1000)`.
3. Fix `chooseModelingPattern()` to return `"REFERENCE"` when `isUnbounded` or `sharedAcrossParents` is true, else `"EMBED"`.
4. Fix `buildEsrCompoundIndex()` to follow the ESR rule: Equality -> Sort -> Range!
5. Run `npm test`.
