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
