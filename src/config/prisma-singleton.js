export function getPrismaSingleton(factory, globalStore = globalThis) {
  if (!globalStore.__prismaClient) {
    globalStore.__prismaClient = factory();
  }
  return globalStore.__prismaClient;
}
