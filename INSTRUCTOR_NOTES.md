# Instructor Explain Guide — Session 8: Prisma ORM & Singleton Pooling

## Live Demos
1. Walk through `prisma/schema.prisma` (`@map("_id") @db.ObjectId`, `onDelete: Cascade`, `@@index`, `@@map`).
2. Show `src/config/prisma-singleton.js` — caching client on `globalThis` so `node --watch` never leaks socket pools!
3. Run `npm test`.
