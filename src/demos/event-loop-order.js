export function getExpectedEventLoopOrder() {
  // TODO(student): Put these 4 labels in the EXACT order Node.js executes them:
  // "1-sync", "2-nextTick", "3-promise-microtask", "4-timer-macrotask"
  return ["1-sync", "4-timer-macrotask", "3-promise-microtask", "2-nextTick"];
}
