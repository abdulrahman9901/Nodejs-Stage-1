/**
 * TODO(student): Implement PrismaWorkspaceRepository wrapping the Prisma Client:
 * - findAll(): Promise<Workspace[]>
 * - findById(id): Promise<Workspace | null>
 * - findByName(name): Promise<Workspace | null>
 * - create(data): Promise<Workspace> (pass { name: data.name, ownerId: data.ownerId })
 * - deleteById(id): Promise<boolean> (must return false if record not found / throws)
 */
export class PrismaWorkspaceRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async findAll() {
    return [];
  }

  async findById(id) {
    return null;
  }

  async findByName(name) {
    return null;
  }

  async create(data) {
    return null;
  }

  async deleteById(id) {
    return false;
  }
}
