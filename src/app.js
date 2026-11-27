import express from "express";
import { AuthService } from "./modules/auth/auth.service.js";
import { verifyJwt } from "./modules/auth/crypto-auth.js";

export function createApp(authService = new AuthService()) {
  const app = express();
  app.use(express.json());

  app.post("/api/v1/auth/register", async (req, res, next) => {
    try {
      const user = await authService.register(req.body || {});
      return res.status(201).json({
        success: true,
        message: "User registered",
        data: user,
      });
    } catch (err) {
      return next(err);
    }
  });

  app.post("/api/v1/auth/login", async (req, res, next) => {
    try {
      const result = await authService.login(req.body || {});
      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  });

  app.get("/api/v1/auth/me", (req, res) => {
    const authHeader = req.headers?.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        errorCode: "UNAUTHENTICATED",
        message: "Missing or invalid Bearer token",
      });
    }
    try {
      const decoded = verifyJwt(authHeader.slice("Bearer ".length).trim(), authService.jwtSecret);
      return res.status(200).json({
        success: true,
        message: "Current user fetched",
        data: { id: decoded.sub, email: decoded.email, role: decoded.role },
      });
    } catch {
      return res.status(401).json({
        success: false,
        errorCode: "UNAUTHENTICATED",
        message: "Invalid or expired token",
      });
    }
  });

  app.use((err, _req, res, _next) => {
    return res.status(err.statusCode || 500).json({
      success: false,
      errorCode: err.errorCode || "INTERNAL_ERROR",
      message: err.message || "Internal Server Error",
    });
  });

  return app;
}
