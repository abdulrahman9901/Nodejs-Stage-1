export class WorkspaceService {
  constructor(workspaceRepo) {
    this.workspaceRepo = workspaceRepo;
  }

  sanitize(workspace) {
    // TODO(student): Strip `internalFlag` from workspace and return the clean DTO
    return workspace;
  }

  async listWorkspaces() {
    // TODO(student): Fetch all workspaces from this.workspaceRepo and sanitize each item
    return [];
  }

  async getWorkspaceById(id) {
    // TODO(student): Find workspace by id; throw Error with statusCode = 404 if missing; return sanitized DTO
    return null;
  }

  async createWorkspace({ name, ownerId }) {
    // TODO(student):
    // 1. Trim `name` and reject length < 3 with Error (err.statusCode = 422, err.errorCode = "VALIDATION_ERROR")
    // 2. Check duplicate via this.workspaceRepo.findByName(cleanName) -> throw Error (err.statusCode = 409, err.errorCode = "CONFLICT")
    // 3. Create via this.workspaceRepo.create({ name: cleanName, ownerId: ownerId || null }) and return this.sanitize(created)
    return this.workspaceRepo.create({ name, ownerId });
  }

  async deleteWorkspace(id) {
    // TODO(student): Delete via this.workspaceRepo.deleteById(id); if false, throw Error with statusCode = 404
  }
}
