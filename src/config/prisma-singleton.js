export function getPrismaSingleton(factory, globalStore = globalThis) {
  // TODO(student): BUG! Calling factory() every time leaks DB socket pools on hot reload!
  return factory();
}
