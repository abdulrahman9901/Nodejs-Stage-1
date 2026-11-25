/**
 * Prisma-backed WorkspaceRepository implementing the clean repository contract:
 * - findAll()
 * - findById(id)
 * - findByName(name)
 * - create(data)
 * - deleteById(id)
 */
export class PrismaWorkspaceRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async findAll() {
    return this.prisma.workspace.findMany();
  }

  async findById(id) {
    return this.prisma.workspace.findUnique({
      where: { id },
    });
  }

  async findByName(name) {
    // In MongoDB / Prisma, exact match or insensitive where available
    return this.prisma.workspace.findFirst({
      where: { name },
    });
  }

  async create(data) {
    return this.prisma.workspace.create({
      data: {
        name: data.name,
        ownerId: data.ownerId,
        internalFlag: true,
      },
    });
  }

  async deleteById(id) {
    try {
      await this.prisma.workspace.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }
}
