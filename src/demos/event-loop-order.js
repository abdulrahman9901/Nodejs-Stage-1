export function runEventLoopDemo() {
  return new Promise((resolve) => {
    // Run inside a fresh macrotask tick (setImmediate) so nextTick vs Promise priority is canonical
    setImmediate(() => {
      const order = [];
      order.push("sync");

      setTimeout(() => {
        order.push("timer-macrotask");
        resolve(order);
      }, 0);

      Promise.resolve().then(() => {
        order.push("promise-microtask");
      });

      process.nextTick(() => {
        order.push("nextTick");
      });
    });
  });
}

export function getExpectedEventLoopOrder() {
  return ["sync", "nextTick", "promise-microtask", "timer-macrotask"];
}

const isDirectRun =
  process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"));
if (isDirectRun) {
  const order = await runEventLoopDemo();
  console.log("[S03] Real Node.js Event Loop execution order:");
  order.forEach((step, idx) => console.log(`  ${idx + 1}. ${step}`));
}
