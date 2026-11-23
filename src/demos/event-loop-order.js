export function runEventLoopDemo() {
  return new Promise((resolve) => {
    // Run inside a fresh macrotask tick (setImmediate) so nextTick vs Promise priority is canonical
    setImmediate(() => {
      const order = [];
      order.push("1-sync");

      setTimeout(() => {
        order.push("4-timer-macrotask");
        resolve(order);
      }, 0);

      Promise.resolve().then(() => {
        order.push("3-promise-microtask");
      });

      process.nextTick(() => {
        order.push("2-nextTick");
      });
    });
  });
}
