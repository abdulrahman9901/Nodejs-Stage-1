export function createTaskHandler(req, res) {
  const workspaceId = req.params?.workspaceId || req.body?.workspaceId;
  const title = req.body?.title?.trim();

  if (!title) {
    return res.status(422).json({
      success: false,
      errorCode: "VALIDATION_ERROR",
      message: "Task title is required",
    });
  }

  return res.status(201).json({
    success: true,
    message: "Task created",
    data: { title, workspaceId: workspaceId || null },
  });
}

export const nestedRouterOptions = { mergeParams: true };
