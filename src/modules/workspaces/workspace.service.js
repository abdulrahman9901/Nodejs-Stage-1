export class WorkspaceService {
  constructor(workspaceRepo) {
    this.workspaceRepo = workspaceRepo;
  }

  async createWorkspace({ name, ownerId }) {
    // TODO(student): Validate name >= 3 chars (422), check duplicate via workspaceRepo (409),
    // create workspace, and strip internalFlag before returning!
    return this.workspaceRepo.create({ name, ownerId });
  }
}
