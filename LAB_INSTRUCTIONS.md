# Student Lab — Session 1: Networking Binding Bug & GitFlow

## Part A: Fix the Container Binding Bug
1. Open `src/scripts/network-preflight.js`.
2. Right now, `getBindingConfig()` binds to `127.0.0.1`, which traps the server inside Docker containers!
3. Fix `host` default to `"0.0.0.0"` and set `isContainerSafe` to `true` when host is `"0.0.0.0"`.
4. Implement `listIPv4Interfaces()` using `os.networkInterfaces()` to return all IPv4 addresses.
5. Run `npm test` — all tests in `tests/s01.test.js` must pass!

## Part B: Practice Resolving a Real Git Merge Conflict!
```bash
git checkout -b my-conflict-practice student/s01-conflict-branch-a
git merge student/s01-conflict-branch-b
# Open src/config/server-config.js, resolve the <<<<<<< HEAD conflict markers,
# keep BOTH port 4000 and maxConnections: 100, then:
git add src/config/server-config.js
git commit -m "fix(s01): resolve merge conflict between branch-a and branch-b"
```
