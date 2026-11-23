export function isValidObjectId(id) {
  return typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
}

export function formatErrorResponse(err, nodeEnv = "production") {
  if (err.code === "P2002") {
    return { statusCode: 409, body: { success: false, errorCode: "DUPLICATE_RECORD", message: "Duplicate unique field" } };
  }
  if (err.code === "P2025") {
    return { statusCode: 404, body: { success: false, errorCode: "RECORD_NOT_FOUND", message: "Record not found" } };
  }
  if (err.isOperational) {
    return { statusCode: err.statusCode, body: { success: false, errorCode: err.errorCode, message: err.message } };
  }
  const isDev = nodeEnv === "development";
  return {
    statusCode: 500,
    body: {
      success: false,
      errorCode: "INTERNAL_SERVER_ERROR",
      message: isDev ? err.message : "Internal Server Error",
      ...(isDev && { stack: err.stack }),
    },
  };
}
