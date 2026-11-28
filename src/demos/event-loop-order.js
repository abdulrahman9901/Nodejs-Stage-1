/**
 * Demonstrates how the Node.js Event Loop executes:
 * 1. Normal Synchronous functions & console.log() (Call Stack)
 * 2. Promises (.then / async-await) (Microtask Queue)
 * 3. Timer Callbacks (setTimeout) (Callback / Macrotask Queue)
 */
export function runEventLoopDemo() {
  const logs = [];

  function runSyncStart() {
    console.log("1. Start (Synchronous)");
    logs.push("1. Start (Synchronous)");
  }

  function runTimerCallback(done) {
    setTimeout(() => {
      console.log("4. Timeout Callback (0ms Timer)");
      logs.push("4. Timeout Callback (0ms Timer)");
      done(logs);
    }, 0);
  }

  function runPromiseTask() {
    Promise.resolve().then(() => {
      console.log("3. Promise.then (Microtask)");
      logs.push("3. Promise.then (Microtask)");
    });
  }

  function runSyncEnd() {
    console.log("2. End (Synchronous)");
    logs.push("2. End (Synchronous)");
  }

  // Call the functions in sequence inside our main function:
  return new Promise((resolve) => {
    runSyncStart();
    runTimerCallback(resolve);
    runPromiseTask();
    runSyncEnd();
  });
}

export function getExpectedEventLoopOrder() {
  return [
    "1. Start (Synchronous)",
    "2. End (Synchronous)",
    "3. Promise.then (Microtask)",
    "4. Timeout Callback (0ms Timer)",
  ];
}

// Run directly in terminal: node src/demos/event-loop-order.js
const isDirectRun =
  process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"));
if (isDirectRun) {
  await runEventLoopDemo();
}
