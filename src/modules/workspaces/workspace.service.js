export class WorkspaceService {
  constructor(workspaceRepo) {
    this.workspaceRepo = workspaceRepo; // Constructor Dependency Injection
  }

  sanitize(workspace) {
    const { internalFlag, ...dto } = workspace;
    return dto;
  }

  async listWorkspaces() {
    const items = await this.workspaceRepo.findAll();
    return items.map((w) => this.sanitize(w));
  }

  async getWorkspaceById(id) {
    const found = await this.workspaceRepo.findById(id);
    if (!found) {
      const err = new Error(`Workspace "${id}" not found`);
      err.statusCode = 404;
      err.errorCode = "NOT_FOUND";
      throw err;
    }
    return this.sanitize(found);
  }

  async createWorkspace({ name, ownerId }) {
    const cleanName = name?.trim() || "";
    if (cleanName.length < 3) {
      const err = new Error("Workspace name must be at least 3 characters");
      err.statusCode = 422;
      err.errorCode = "VALIDATION_ERROR";
      throw err;
    }

    const existing = await this.workspaceRepo.findByName(cleanName);
    if (existing) {
      const err = new Error("Workspace name already exists");
      err.statusCode = 409;
      err.errorCode = "CONFLICT";
      throw err;
    }

    const created = await this.workspaceRepo.create({ name: cleanName, ownerId: ownerId || null });
    return this.sanitize(created);
  }

  async deleteWorkspace(id) {
    const deleted = await this.workspaceRepo.deleteById(id);
    if (!deleted) {
      const err = new Error(`Workspace "${id}" not found`);
      err.statusCode = 404;
      err.errorCode = "NOT_FOUND";
      throw err;
    }
  }
}
