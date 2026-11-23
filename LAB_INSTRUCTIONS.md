# Student Lab — Session 9: ObjectId Validation & Global Error Handler

## Tasks
1. Open `src/middlewares/error-handler.js`.
2. Implement `isValidObjectId(id)` using the strict 24-hex regex `/^[0-9a-fA-F]{24}$/`.
3. Update `formatErrorResponse(err, nodeEnv)`:
   - Translate Prisma `P2002` -> `statusCode: 409` and `P2025` -> `statusCode: 404`.
   - For operational `AppError` (`err.isOperational === true`), return `err.statusCode` and `err.message`.
   - For unknown 500 programmer bugs in `"production"`, return `"Internal Server Error"` with NO `stack` property!
4. Run `npm test`.
