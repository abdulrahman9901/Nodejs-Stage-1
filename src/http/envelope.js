export function okEnvelope(message, data = null) {
  // TODO(student): Return standardized envelope { success: true, message, data }
  return { data };
}

export function errorEnvelope(errorCode, message, errors = []) {
  // TODO(student): Return { success: false, errorCode, message } + errors if non-empty
  return { message };
}

export function getStatusForAction(action) {
  // TODO(student): Return accurate HTTP status codes (200, 201, 204, 400, 401, 403, 404, 409, 422)
  return 200;
}

/**
 * Returns the TaskHub ERD Blueprint mapping each Database Entity to its
 * Primary Key (PK), Foreign Keys (FK), Relationship Cardinality (1:1, 1:N, N:1, N:M),
 * and corresponding REST API endpoint.
 */
export function getTaskHubErdBlueprint() {
  // TODO(student): Complete the ERD keys (primaryKey: "id", foreignKeys, relationships, and restEndpoint)
  return {
    User: {
      primaryKey: "", // TODO: set to "id"
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
      foreignKeys: [], // TODO: add "ownerId" Foreign Key
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
        { type: "N:M", target: "Tag", junctionEntity: "" }, // TODO: set junctionEntity to "TaskTag"
      ],
      restEndpoint: "/api/v1/tasks",
    },
  };
}
