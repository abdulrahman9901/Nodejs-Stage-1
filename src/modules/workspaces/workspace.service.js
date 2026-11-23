export class WorkspaceService {
  constructor(workspaceRepo) {
    this.workspaceRepo = workspaceRepo; // Constructor Dependency Injection
  }

  sanitize(workspace) {
    const { internalFlag, ...dto } = workspace;
    return dto;
  }

  async createWorkspace({ name, ownerId }) {
    const cleanName = name?.trim() || "";
    if (cleanName.length < 3) {
      const err = new Error("Workspace name must be at least 3 characters");
      err.statusCode = 422;
      throw err;
    }

    const existing = await this.workspaceRepo.findByName(cleanName);
    if (existing) {
      const err = new Error("Workspace name already exists");
      err.statusCode = 409;
      throw err;
    }

    const created = await this.workspaceRepo.create({ name: cleanName, ownerId });
    return this.sanitize(created);
  }
}
