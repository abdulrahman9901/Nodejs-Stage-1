export function isValidObjectId(id) {
  return typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
}

export function formatErrorResponse(err, nodeEnv = "production") {
  if (err.code === "P2002") {
    return {
      statusCode: 409,
      body: { success: false, errorCode: "DUPLICATE_RECORD", message: "Duplicate unique field" },
    };
  }
  if (err.code === "P2025") {
    return {
      statusCode: 404,
      body: { success: false, errorCode: "RECORD_NOT_FOUND", message: "Record not found" },
    };
  }
  if (err.code === "P2023") {
    return {
      statusCode: 400,
      body: { success: false, errorCode: "MALFORMED_OBJECT_ID", message: "Malformed ObjectId" },
    };
  }
  if (err.isOperational) {
    return {
      statusCode: err.statusCode,
      body: { success: false, errorCode: err.errorCode, message: err.message },
    };
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

/**
 * 4-argument Express global error-handling middleware.
 */
export function globalErrorHandler(err, _req, res, _next) {
  const { statusCode, body } = formatErrorResponse(err, process.env.NODE_ENV || "production");
  return res.status(statusCode).json(body);
}
