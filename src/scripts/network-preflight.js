import os from "node:os";
import dns from "node:dns/promises";
import { performance } from "node:perf_hooks";

export function getBindingConfig(env = process.env) {
  // TODO(student): Fix the 127.0.0.1 Docker binding trap! Default host must be "0.0.0.0".
  const host = env.HOST || "127.0.0.1";
  return {
    host,
    port: Number(env.PORT) || 3000,
    isContainerSafe: false, // TODO(student): Should be true when host === "0.0.0.0"
  };
}

export function listIPv4Interfaces() {
  // TODO(student): Use os.networkInterfaces() and return array of { name, address, internal } for IPv4
  return [];
}

export async function resolveDnsPreflight(hostname = "localhost") {
  // TODO(student): Use dns.lookup(hostname) and performance.now() to return:
  // { hostname, address: resolved.address, family: resolved.family, latencyMs }
  return { hostname, address: "", family: 0, latencyMs: -1 };
}
