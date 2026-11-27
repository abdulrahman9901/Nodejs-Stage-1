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

export const taskQuerySchema = z.object({
  params: z.object({
    workspaceId: objectIdSchema,
  }),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
  }),
});

/**
 * TODO(student): Implement the reusable Express Zod validation gate middleware!
 * 1. Run `schema.safeParse({ body: req.body ?? {}, params: req.params ?? {}, query: req.query ?? {} })`
 * 2. If `!result.success`, return status 422 with:
 *    `{ success: false, errorCode: "VALIDATION_ERROR", message: "Request validation failed", errors }`
 *    where each error is `{ field: issue.path.join("."), message: issue.message }`
 * 3. Store `req.validated = result.data`; assign `body`/`params`, and use `Object.defineProperty(req, 'query', { value: result.data.query, writable: true, configurable: true, enumerable: true })` (Express 5 `req.query` is a getter!).
 */
export function validate(_schema) {
  return (_req, _res, next) => {
    return next();
  };
}
