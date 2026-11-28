import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

/**
 * BAD: Synchronous CPU loop blocks the single-threaded Event Loop until finished.
 */
export function countPrimesBlocking(limit) {
  let count = 0;
  for (let n = 2; n <= limit; n++) {
    if (isPrime(n)) count++;
  }
  return count;
}

/**
 * GOOD: Chunked computation yields back to the Event Loop via setImmediate()
 * so concurrent timers and incoming HTTP requests keep being served.
 */
export async function countPrimesNonBlocking(limit, chunkSize = 2000) {
  let count = 0;
  for (let start = 2; start <= limit; start += chunkSize) {
    const end = Math.min(start + chunkSize - 1, limit);
    for (let n = start; n <= end; n++) {
      if (isPrime(n)) count++;
    }
    await new Promise((resolve) => setImmediate(resolve));
  }
  return count;
}

/**
 * Pure ESM replacement for CommonJS __dirname + fs.readFileSync:
 * Resolves package.json relative to import.meta.url and reads it asynchronously.
 */
export async function readPackageJsonAsync() {
  const pkgPath = fileURLToPath(new URL("../../package.json", import.meta.url));
  const raw = await readFile(pkgPath, "utf8");
  return JSON.parse(raw);
}

/**
 * Simulates an asynchronous MongoDB document query (Non-Blocking I/O) and
 * translates the raw BSON/MongoDB document (`_id`, `passwordHash`) into a safe
 * Data Transfer Object (DTO) with Primary Key `id` and Foreign Keys intact.
 */
export async function fetchAndSanitizeMongoDocument(rawDoc) {
  // Simulate non-blocking database network I/O on the Event Loop
  await new Promise((resolve) => setImmediate(resolve));
  const { _id, passwordHash, ...safeFields } = rawDoc;
  return {
    id: String(_id),
    ...safeFields,
  };
}

const isDirectRun =
  process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"));
if (isDirectRun) {
  console.log("[S03] Demo 1: Blocking loop (watch heartbeat freeze)");
  let blockingTicks = 0;
  const t1 = setInterval(() => blockingTicks++, 5);
  const c1 = countPrimesBlocking(200_000);
  clearInterval(t1);
  console.log(`  Blocking count=${c1}, heartbeat ticks during work=${blockingTicks}`);

  console.log("[S03] Demo 2: Non-blocking chunked loop (heartbeat stays alive)");
  let nonBlockingTicks = 0;
  const t2 = setInterval(() => nonBlockingTicks++, 5);
  const c2 = await countPrimesNonBlocking(200_000, 5000);
  clearInterval(t2);
  console.log(`  Non-blocking count=${c2}, heartbeat ticks during work=${nonBlockingTicks}`);

  const pkg = await readPackageJsonAsync();
  console.log(`[S03] Pure ESM readPackageJsonAsync -> ${pkg.name} (type: ${pkg.type})`);
}
