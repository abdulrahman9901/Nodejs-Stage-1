import os from "node:os";
import dns from "node:dns/promises";
import { performance } from "node:perf_hooks";

/**
 * 1. Container & Cloud Binding Configuration:
 * - Binding to `127.0.0.1` (loopback) only accepts traffic from inside the same machine/container.
 * - Binding to `0.0.0.0` listens on ALL IPv4 network adapters so Docker port-forwarding works.
 */
export function getBindingConfig(env = process.env) {
  const host = env.HOST || "0.0.0.0";
  return {
    host,
    port: Number(env.PORT) || 3000,
    isContainerSafe: host === "0.0.0.0",
  };
}

/**
 * 2. Local Network Interface Inspection (`os.networkInterfaces()`):
 * - `internal: true`  -> Virtual loopback adapter (`127.0.0.1`)
 * - `internal: false` -> External LAN / Wi-Fi / Docker adapter (e.g. `192.168.1.x`)
 */
export function listIPv4Interfaces() {
  const interfaces = os.networkInterfaces();
  const result = [];
  for (const [name, addrs] of Object.entries(interfaces)) {
    for (const addr of addrs || []) {
      if (addr.family === "IPv4") {
        result.push({ name, address: addr.address, internal: addr.internal });
      }
    }
  }
  return result;
}

/**
 * 3. DNS Resolution & Latency Preflight (`dns.lookup`):
 * - Translates a hostname (e.g. "localhost") into an IP address (`127.0.0.1` or `::1`)
 *   and measures lookup latency in milliseconds.
 */
export async function resolveDnsPreflight(hostname = "localhost") {
  const start = performance.now();
  const resolved = await dns.lookup(hostname);
  const latencyMs = Number((performance.now() - start).toFixed(2));
  return {
    hostname,
    address: resolved.address,
    family: resolved.family,
    latencyMs,
  };
}

// Direct-run guard: only prints when executed via `node src/scripts/network-preflight.js`
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"))) {
  console.log("[PREFLIGHT] Binding Config:", getBindingConfig());
  console.log("[PREFLIGHT] IPv4 Interfaces:", listIPv4Interfaces());
  console.log("[PREFLIGHT] DNS Lookup:", await resolveDnsPreflight("localhost"));
}
