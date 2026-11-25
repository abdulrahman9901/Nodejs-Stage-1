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
 * Reusable Express Zod validation gate middleware.
 * Validates { body, params, query } and returns 422 VALIDATION_ERROR on failure.
 */
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body ?? {},
      params: req.params ?? {},
      query: req.query ?? {},
    });

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return res.status(422).json({
        success: false,
        errorCode: "VALIDATION_ERROR",
        message: "Request validation failed",
        errors,
      });
    }

    if (result.data.body) req.body = result.data.body;
    if (result.data.params) req.params = result.data.params;
    if (result.data.query) req.query = result.data.query;
    return next();
  };
}
