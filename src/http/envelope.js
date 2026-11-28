export function okEnvelope(message, data = null) {
  return { success: true, message, data };
}

export function errorEnvelope(errorCode, message, errors = []) {
  return { success: false, errorCode, message, ...(errors.length ? { errors } : {}) };
}

export function getStatusForAction(action) {
  const map = {
    READ: 200,
    CREATE: 201,
    DELETE: 204,
    BAD_JSON: 400,
    UNAUTHENTICATED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    VALIDATION_ERROR: 422,
  };
  return map[action] ?? 500;
}

/**
 * Returns the TaskHub ERD Blueprint mapping each Database Entity to its
 * Primary Key (PK), Foreign Keys (FK), Relationship Cardinality (1:1, 1:N, N:1, N:M),
 * and corresponding REST API endpoint.
 */
export function getTaskHubErdBlueprint() {
  return {
    User: {
      primaryKey: "id",
      uniqueKeys: ["email"],
      foreignKeys: [],
      relationships: [
        { type: "1:1", target: "UserProfile", foreignKeyOnTarget: "userId" },
        { type: "1:N", target: "Workspace", foreignKeyOnTarget: "ownerId" },
      ],
      restEndpoint: "/api/v1/users",
    },
    Workspace: {
      primaryKey: "id",
      uniqueKeys: ["name"],
      foreignKeys: ["ownerId"],
      relationships: [
        { type: "N:1", target: "User", foreignKey: "ownerId" },
        { type: "1:N", target: "Task", foreignKeyOnTarget: "workspaceId" },
      ],
      restEndpoint: "/api/v1/workspaces",
    },
    Task: {
      primaryKey: "id",
      uniqueKeys: [],
      foreignKeys: ["workspaceId", "assigneeId"],
      relationships: [
        { type: "N:1", target: "Workspace", foreignKey: "workspaceId" },
        { type: "N:1", target: "User", foreignKey: "assigneeId" },
        { type: "N:M", target: "Tag", junctionEntity: "TaskTag" },
      ],
      restEndpoint: "/api/v1/tasks",
    },
  };
}
