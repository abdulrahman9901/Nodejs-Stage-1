export function runEventLoopDemo() {
  return new Promise((resolve) => {
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
  // TODO(student): Put these 4 labels in the EXACT order Node.js executes them!
  // Labels: "sync", "nextTick", "promise-microtask", "timer-macrotask"
  return ["sync", "timer-macrotask", "promise-microtask", "nextTick"];
}
