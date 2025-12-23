import { Router } from "express";
import {
  signup,
  login,
  logout,
  getSession,
} from "../controller/auth.controller";
import AuthMiddleware from "../middleware/auth.middleware";

const AuthRouter = Router();
console.log("[AUTH-ROUTER] Initializing auth routes");

// Public routes
AuthRouter.post("/signup", signup);
console.log(" [AUTH-ROUTER] POST /signup registered");
AuthRouter.post("/login", login);
console.log(" [AUTH-ROUTER] POST /login registered");

// Protected routes
AuthRouter.post("/logout", AuthMiddleware, logout);
console.log(" [AUTH-ROUTER] POST /logout registered (protected)");
AuthRouter.get("/session", AuthMiddleware, getSession);
console.log(" [AUTH-ROUTER] GET /session registered (protected)");

console.log(" [AUTH-ROUTER] All auth routes registered");

export default AuthRouter;
