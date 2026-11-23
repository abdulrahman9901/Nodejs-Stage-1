# Instructor Explain Guide — Session 7: MongoDB Modeling, ObjectId & ESR Indexes

## Live Demos
1. Inspect `src/db/mongodb-modeling.js`:
   - Extract exact Unix timestamp from the first 4 bytes (8 hex chars) of any 24-hex ObjectId.
   - Recommend `"EMBED"` vs `"REFERENCE"` based on boundedness & 16MB limit.
   - Order compound index fields strictly by the **ESR Rule** (Equality -> Sort -> Range).
2. Run `npm test`.
