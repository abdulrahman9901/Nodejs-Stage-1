export function isValidObjectId(id) {
  // TODO(student): Enforce strict 24-hex MongoDB ObjectId regex
  return Boolean(id);
}

export function formatErrorResponse(err, nodeEnv = "production") {
  // TODO(student): Translate Prisma P2002 (409) & P2025 (404), handle AppError, and hide 500 details in production!
  return {
    statusCode: 500,
    body: { success: false, message: err.message, stack: err.stack },
  };
}
