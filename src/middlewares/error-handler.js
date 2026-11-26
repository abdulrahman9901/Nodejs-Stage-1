export function isValidObjectId(id) {
  // TODO(student): Enforce strict 24-hex MongoDB ObjectId regex
  return Boolean(id);
}

export function formatErrorResponse(err, nodeEnv = "production") {
  // TODO(student):
  // 1. Translate Prisma P2002 -> 409 DUPLICATE_RECORD, P2025 -> 404 RECORD_NOT_FOUND, P2023 -> 400 MALFORMED_OBJECT_ID
  // 2. For operational AppError (err.isOperational === true), return err.statusCode, err.errorCode, and err.message
  // 3. For unknown 500 bugs in "production", return message "Internal Server Error" and omit `stack`!
  return {
    statusCode: 500,
    body: { success: false, message: err.message, stack: err.stack },
  };
}

export function globalErrorHandler(err, _req, res, _next) {
  const { statusCode, body } = formatErrorResponse(err, process.env.NODE_ENV || "production");
  return res.status(statusCode).json(body);
}
