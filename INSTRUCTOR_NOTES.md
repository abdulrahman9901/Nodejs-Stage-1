# Instructor Explain Guide — Session 1: Networking & GitFlow

## Live Demos on This Branch
1. **Networking & DNS Preflight (`node src/scripts/network-preflight.js`)**:
   - Show `0.0.0.0` (all interfaces, Docker-safe) vs `127.0.0.1` (loopback only).
   - Inspect local NICs (`os.networkInterfaces()` — `internal: true` vs `false`).
   - Show live DNS resolution & latency (`dns.lookup("localhost")`).
2. **TCP 4-Tuple & Raw HTTP Over TCP (`node src/scripts/tcp-4tuple-demo.js`)**:
   - Run `curl http://localhost:3000` 3 times in another terminal to show the server port staying `3000` while the client's ephemeral port (`remotePort`) increments on every request.
   - Walk through `socket.setKeepAlive(true, 30_000)`, `socket.on("error", ...)`, and the raw HTTP/1.1 text response.
3. **GitFlow Merge Conflict Demo**:
   ```bash
   git checkout -b instructor-conflict-demo origin/student/s01-conflict-branch-a
   git merge origin/student/s01-conflict-branch-b
   # Open src/config/server-config.js and resolve <<<<<<< HEAD markers live on screen!
   ```
4. **Verify**: Run `npm test` to confirm all 5 Session 1 checks pass.
