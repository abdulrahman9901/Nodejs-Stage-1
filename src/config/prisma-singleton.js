export function getPrismaSingleton(factory, globalStore = globalThis) {
  // TODO(student): BUG! Calling factory() every time leaks DB socket pools on hot reload!
  // Cache the client on globalStore.__prismaClient so subsequent calls return the existing instance.
  return factory();
}
