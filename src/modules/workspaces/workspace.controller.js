export class WorkspaceController {
  constructor(workspaceService) {
    this.workspaceService = workspaceService;
  }

  list = async (_req, res, next) => {
    try {
      // TODO(student): Call this.workspaceService.listWorkspaces() and return 200 JSON envelope
      return res.status(501).json({ success: false, message: "Not implemented" });
    } catch (err) {
      return next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      // TODO(student): Call this.workspaceService.getWorkspaceById(req.params.id) and return 200 JSON envelope
      return res.status(501).json({ success: false, message: "Not implemented" });
    } catch (err) {
      return next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      // TODO(student): Call this.workspaceService.createWorkspace({ name: req.body?.name, ownerId: req.body?.ownerId })
      // and return 201 JSON envelope { success: true, message: "Workspace created", data }
      return res.status(501).json({ success: false, message: "Not implemented" });
    } catch (err) {
      return next(err);
    }
  };

  remove = async (req, res, next) => {
    try {
      // TODO(student): Call this.workspaceService.deleteWorkspace(req.params.id) and return 204 (empty body)
      return res.status(501).json({ success: false, message: "Not implemented" });
    } catch (err) {
      return next(err);
    }
  };
}
