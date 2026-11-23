import os from "node:os";

export function getBindingConfig(env = process.env) {
  return {
    host: env.HOST || "0.0.0.0", // Safe for Docker & Cloud VMs (not trapped on 127.0.0.1!)
    port: Number(env.PORT) || 3000,
    isContainerSafe: (env.HOST || "0.0.0.0") === "0.0.0.0",
  };
}

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

if (process.argv[1]?.endsWith("network-preflight.js")) {
  console.log("[PREFLIGHT] Binding Config:", getBindingConfig());
  console.log("[PREFLIGHT] IPv4 Interfaces:", listIPv4Interfaces());
}
