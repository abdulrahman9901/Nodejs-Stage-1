# TaskHub Course Lab — Stage 1 Node.js Back-End Engineering

This repository is designed for live teaching and hands-on student labs across all **12 sessions** of Stage 1.

- **`main`** contains a clean, runnable basic Node.js (ESM) starter app (`npm start` / `npm test`).
- **`instructor/sXX-...`** branches contain the **complete, working reference code** for the instructor to explain live in class (`npm test` passes 100%).
- **`student/sXX-...`** branches contain **hands-on challenges** with `LAB_INSTRUCTIONS.md`, starter/broken code (`// TODO(student)`), and automated self-check tests (`npm test` starts failing and turns green once the student solves the lab!).

---

## Quick Start

```bash
# 1. List all available instructor & student branches
git branch -a

# 2. Switch to a student lab branch
git checkout student/s01-networking-lab

# 3. Read the lab instructions & run automated tests
cat LAB_INSTRUCTIONS.md   # PowerShell: Get-Content LAB_INSTRUCTIONS.md   # PowerShell: Get-Content LAB_INSTRUCTIONS.md
npm test

# 4. Compare your work against the instructor solution
git diff student/s01-networking-lab..instructor/s01-networking-and-gitflow
```

---

## Complete 12-Session Branch Map

| Session | Instructor Explain Branch | Student Test / Lab Branch(es) | Core Concept & Lab Challenge |
| :--- | :--- | :--- | :--- |
| **Base** | `main` | — | Runnable basic Node.js ESM HTTP server + `node --test` setup |
| **S01** | `instructor/s01-networking-and-gitflow` | `student/s01-networking-lab`<br>`student/s01-conflict-branch-a`<br>`student/s01-conflict-branch-b` | Networking preflight (`0.0.0.0` vs `127.0.0.1`), TCP 4-tuple, **real Git merge conflict resolution lab** |
| **S02** | `instructor/s02-http-rest-and-postman` | `student/s02-http-rest-lab` | HTTP status codes (`201`/`204`/`404`/`422`), JSON envelopes, Postman collection |
| **S03** | `instructor/s03-event-loop-and-esm` | `student/s03-event-loop-and-esm-lab` | Event Loop phases, Microtasks vs Macrotasks, fail-fast `env-validator.js`, fixing blocking code |
| **S04** | `instructor/s04-streams-events-and-raw-http` | `student/s04-streams-and-events-lab` | UTF-8 `Buffer.byteLength`, `EventEmitter` audit logger, `pipeline()` Gzip streams |
| **S05** | `instructor/s05-express-routing-middleware` | `student/s05-express-routing-lab` | `app.js` vs `server.js`, `X-Request-Id` middleware, `mergeParams`, fixing `ERR_HTTP_HEADERS_SENT` |
| **S06** | `instructor/s06-clean-architecture` | `student/s06-clean-architecture-lab` | Refactoring spaghetti route into 3-Tier Clean Architecture (`Controller -> Service -> Repo`) with DI & DTOs |
| **S07** | `instructor/s07-mongodb-modeling-indexes` | `student/s07-mongodb-modeling-lab` | 12-byte ObjectId timestamp extraction, Embedding vs Referencing fix, ESR Compound Index |
| **S08** | `instructor/s08-prisma-orm-repositories` | `student/s08-prisma-orm-lab` | `schema.prisma` (`@map("_id")`, `onDelete: Cascade`, `@@index`), `globalThis` singleton & Prisma repo |
| **S09** | `instructor/s09-zod-validation-errors` | `student/s09-zod-validation-errors-lab` | 24-hex ObjectId regex, `validate(schema)` gate (422), `AppError` & Prisma `P2002`/`P2025` error handler |
| **S10** | `instructor/s10-jwt-bcrypt-auth` | `student/s10-jwt-bcrypt-auth-lab` | Fixing plaintext password & user enumeration bugs, password hashing, JWT signing & DTO sanitization |
| **S11** | `instructor/s11-rbac-guards-file-uploads` | `student/s11-rbac-guards-uploads-lab` | `authenticate` (401), `authorizeRoles` (403), IDOR ownership fix, Path Traversal & MIME upload hardening |
| **S12** | `instructor/s12-pagination-release-v1` | `student/s12-pagination-release-lab` | Parallel `Promise.all` pagination, sort whitelist, `meta` envelope & `SIGTERM` graceful shutdown |
