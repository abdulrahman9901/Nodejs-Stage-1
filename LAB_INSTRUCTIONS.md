# Student Lab — Session 1: Networking Preflight, TCP 4-Tuple & GitFlow

## Part A: Fix Container Binding, DNS Preflight & TCP 4-Tuple (~25 min)
1. Open `src/scripts/network-preflight.js`:
   - In `getBindingConfig()`, fix `host` default to `"0.0.0.0"` (instead of `"127.0.0.1"`, which traps the server inside Docker containers!) and set `isContainerSafe` to `host === "0.0.0.0"`.
   - Implement `listIPv4Interfaces()` using `os.networkInterfaces()` to return `[{ name, address, internal }]` for every `IPv4` entry.
   - Implement `resolveDnsPreflight(hostname = "localhost")` using `dns.lookup(hostname)` and `performance.now()` to return `{ hostname, address, family, latencyMs }`.
2. Open `src/scripts/tcp-4tuple-demo.js`:
   - Implement `extractTcp4Tuple(socket)` returning `{ clientIp: socket.remoteAddress, clientPort: socket.remotePort, serverIp: socket.localAddress, serverPort: socket.localPort }`.
3. Run `npm test` — all 5 tests in `tests/s01.test.js` must pass!

---

## Part B: Practice Resolving a Real Git Merge Conflict (~20 min)
```bash
git checkout -b my-conflict-practice origin/student/s01-conflict-branch-a
git merge origin/student/s01-conflict-branch-b
# Open src/config/server-config.js, resolve the <<<<<<< HEAD conflict markers,
# keep BOTH port 4000 and maxConnections: 100, then:
git add src/config/server-config.js
git commit -m "fix(s01): resolve merge conflict between branch-a and branch-b"
```
