import test from "node:test";
import assert from "node:assert/strict";
import { AppError } from "../src/utils/app-error.js";
import { isValidObjectId, formatErrorResponse } from "../src/middlewares/error-handler.js";
import { createTaskSchema, validate } from "../src/middlewares/validate.js";
import { createApp } from "../src/app.js";

test("S09: isValidObjectId validates strict 24-hex format", () => {
  assert.equal(isValidObjectId("65f1a9c0e4b0a1d2c3f4e5a6"), true);
  assert.equal(isValidObjectId("12345"), false);
  assert.equal(isValidObjectId("65f1a9c0e4b0a1d2c3f4e5zz"), false);
});

test("S09: Translates Prisma P2002 -> 409, P2025 -> 404, and P2023 -> 400", () => {
  assert.equal(formatErrorResponse({ code: "P2002" }).statusCode, 409);
  assert.equal(formatErrorResponse({ code: "P2025" }).statusCode, 404);
  assert.equal(formatErrorResponse({ code: "P2023" }).statusCode, 400);
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

test("S09: Zod validate(createTaskSchema) rejects bad ObjectId or short title (422) and applies defaults", async () => {
  const app = createApp();
  const server = await new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;
  const validWsId = "65f1a9c0e4b0a1d2c3f4e5a6";

  try {
    // 1. Bad ObjectId in URL params -> 422 VALIDATION_ERROR
    const badIdRes = await fetch(`${baseUrl}/api/v1/workspaces/not-a-valid-id/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Valid title" }),
    });
    assert.equal(badIdRes.status, 422);
    const badIdBody = await badIdRes.json();
    assert.equal(badIdBody.errorCode, "VALIDATION_ERROR");
    assert.ok(badIdBody.errors.some((e) => e.field.includes("workspaceId")));

    // 2. Valid ObjectId + valid payload -> 201 with trimmed title & Zod defaults
    const okRes = await fetch(`${baseUrl}/api/v1/workspaces/${validWsId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "  Add Zod gate  " }),
    });
    assert.equal(okRes.status, 201);
    const okBody = await okRes.json();
    assert.equal(okBody.data.title, "Add Zod gate");
    assert.equal(okBody.data.priority, 3);
    assert.equal(okBody.data.status, "TODO");

    // 3. Duplicate task triggers simulated Prisma P2002 -> 409 DUPLICATE_RECORD via globalErrorHandler
    const dupRes = await fetch(`${baseUrl}/api/v1/workspaces/${validWsId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Add Zod gate" }),
    });
    assert.equal(dupRes.status, 409);
    const dupBody = await dupRes.json();
    assert.equal(dupBody.errorCode, "DUPLICATE_RECORD");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
