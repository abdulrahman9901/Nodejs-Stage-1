export class WorkspaceController {
  constructor(workspaceService) {
    this.workspaceService = workspaceService;
  }

  list = async (_req, res, next) => {
    try {
      const data = await this.workspaceService.listWorkspaces();
      return res.status(200).json({ success: true, message: "Workspaces fetched", data });
    } catch (err) {
      return next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const data = await this.workspaceService.getWorkspaceById(req.params.id);
      return res.status(200).json({ success: true, message: "Workspace fetched", data });
    } catch (err) {
      return next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const data = await this.workspaceService.createWorkspace({
        name: req.body?.name,
        ownerId: req.body?.ownerId,
      });
      return res.status(201).json({ success: true, message: "Workspace created", data });
    } catch (err) {
      return next(err);
    }
  };

  remove = async (req, res, next) => {
    try {
      await this.workspaceService.deleteWorkspace(req.params.id);
      return res.status(204).end();
    } catch (err) {
      return next(err);
    }
  };
}
