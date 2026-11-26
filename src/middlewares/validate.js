import { z } from "zod";
import { isValidObjectId } from "./error-handler.js";

export const objectIdSchema = z
  .string()
  .refine(isValidObjectId, { message: "Must be a valid 24-hex MongoDB ObjectId" });

export const createTaskSchema = z.object({
  params: z.object({
    workspaceId: objectIdSchema,
  }),
  body: z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(120),
    priority: z.number().int().min(1).max(5).default(3),
    status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).default("TODO"),
  }),
});

/**
 * TODO(student): Implement the reusable Express Zod validation gate middleware!
 * 1. Run `schema.safeParse({ body: req.body ?? {}, params: req.params ?? {}, query: req.query ?? {} })`
 * 2. If `!result.success`, return status 422 with:
 *    `{ success: false, errorCode: "VALIDATION_ERROR", message: "Request validation failed", errors }`
 *    where each error is `{ field: issue.path.join("."), message: issue.message }`
 * 3. If valid, assign parsed `result.data.body`, `params`, and `query` back onto `req` and call `next()`!
 */
export function validate(_schema) {
  return (_req, _res, next) => {
    return next();
  };
}
