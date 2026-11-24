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
 * TODO(student): Right now this runs synchronously in one blocking loop,
 * starving the Event Loop so concurrent timers cannot fire!
 * Refactor it to process numbers in chunks of `chunkSize` and yield to
 * the Event Loop between chunks using:
 *   await new Promise((resolve) => setImmediate(resolve));
 */
export async function countPrimesNonBlocking(limit, chunkSize = 2000) {
  let count = 0;
  for (let n = 2; n <= limit; n++) {
    if (isPrime(n)) count++;
  }
  return count;
}

/**
 * TODO(student): In Pure ESM ("type": "module"), CommonJS `__dirname` does NOT exist!
 * Use `fileURLToPath(new URL("../../package.json", import.meta.url))` and
 * `readFile(pkgPath, "utf8")` from `node:fs/promises` to return the parsed JSON object.
 */
export async function readPackageJsonAsync() {
  return {};
}
