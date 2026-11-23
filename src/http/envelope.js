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
