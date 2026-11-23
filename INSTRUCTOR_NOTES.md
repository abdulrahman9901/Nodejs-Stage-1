# Instructor Explain Guide — Session 1: Networking & GitFlow

## Live Demos on This Branch
1. Run `node src/scripts/network-preflight.js` to show local NICs (`os.networkInterfaces()`), DNS latency, and `0.0.0.0` vs `127.0.0.1`.
2. Run `node src/scripts/tcp-4tuple-demo.js` and hit `curl http://localhost:3000` in another terminal to show live Client IP:EphemeralPort <-> Server IP:3000 4-Tuples.
3. Merge Conflict Demo:
   ```bash
   git checkout student/s01-conflict-branch-a
   git merge student/s01-conflict-branch-b
   # Resolve <<<<<<< HEAD markers live on screen!
   ```
4. Run `npm test` to verify all Session 1 checks pass.
