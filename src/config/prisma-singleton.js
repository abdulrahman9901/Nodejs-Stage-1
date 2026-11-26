import { PrismaClient } from "@prisma/client";

export function getPrismaSingleton(factory, globalStore = globalThis) {
  if (!globalStore.__prismaClient) {
    globalStore.__prismaClient = factory();
  }
  return globalStore.__prismaClient;
}

export function getPrismaClient() {
  return getPrismaSingleton(() => new PrismaClient());
}
