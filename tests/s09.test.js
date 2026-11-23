import test from "node:test";
import assert from "node:assert/strict";
import { AppError } from "../src/utils/app-error.js";
import { isValidObjectId, formatErrorResponse } from "../src/middlewares/error-handler.js";

test("S09: isValidObjectId validates strict 24-hex format", () => {
  assert.equal(isValidObjectId("65f1a9c0e4b0a1d2c3f4e5a6"), true);
  assert.equal(isValidObjectId("12345"), false);
  assert.equal(isValidObjectId("65f1a9c0e4b0a1d2c3f4e5zz"), false);
});

test("S09: Translates Prisma P2002 -> 409 and P2025 -> 404", () => {
  assert.equal(formatErrorResponse({ code: "P2002" }).statusCode, 409);
  assert.equal(formatErrorResponse({ code: "P2025" }).statusCode, 404);
});

test("S09: Hides raw programmer bug details & stack in production, shows operational AppError", () => {
  const prodBug = formatErrorResponse(new Error("DB password leaked"), "production");
  assert.equal(prodBug.statusCode, 500);
  assert.equal(prodBug.body.message, "Internal Server Error");
  assert.equal("stack" in prodBug.body, false);

  const op = formatErrorResponse(new AppError("Task not found", 404, "NOT_FOUND"), "production");
  assert.equal(op.statusCode, 404);
  assert.equal(op.body.message, "Task not found");
});
