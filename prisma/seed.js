import { getPrismaClient } from "../src/config/prisma-singleton.js";

const prisma = getPrismaClient();

async function seed() {
  const user = await prisma.user.upsert({
    where: { email: "instructor@taskhub.dev" },
    update: {},
    create: {
      email: "instructor@taskhub.dev",
      name: "TaskHub Instructor",
      passwordHash: "seeded_placeholder_hash",
      role: "ADMIN",
    },
  });

  const workspace = await prisma.workspace.upsert({
    where: { name: "Engineering" },
    update: {},
    create: {
      name: "Engineering",
      ownerId: user.id,
    },
  });

  console.log("[SEED] User:", { id: user.id, email: user.email });
  console.log("[SEED] Workspace:", { id: workspace.id, name: workspace.name });
}

try {
  await seed();
} finally {
  await prisma.$disconnect();
}
