import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CatchError, TryError } from "../util/error";

export interface PayloadInterface {
  id: number;
  email: string;
}

export interface SessionInterface extends Request {
  session?: PayloadInterface;
}

const AuthMiddleware = async (
  req: SessionInterface,
  res: Response,
  next: NextFunction
) => {
  console.log("[AUTH-MIDDLEWARE] Authenticating request");
  try {
    const accessToken = req.cookies?.accessToken;
    console.log(" [AUTH-MIDDLEWARE] Access token present:", !!accessToken);

    if (!accessToken) {
      console.log("[AUTH-MIDDLEWARE] No access token found");
      throw TryError("Failed to authorize user", 401);
    }

    console.log("[AUTH-MIDDLEWARE] Verifying JWT token...");
    const payload = jwt.verify(
      accessToken,
      process.env.AUTH_SECRET!
    ) as JwtPayload;

    if (!payload || !payload.id || !payload.email) {
      console.log(" [AUTH-MIDDLEWARE] Invalid token payload");
      throw TryError("Invalid token payload", 401);
    }

    // attach session (JD-only fields)
    req.session = {
      id: Number(payload.id),
      email: payload.email,
    };
    console.log("[AUTH-MIDDLEWARE] User authenticated:", payload.email, "(ID:", payload.id, ")");

    next();
  } catch (err) {
    console.log("[AUTH-MIDDLEWARE] Authentication failed:", err);
    CatchError(err, res, "Failed to authorize user");
  }
};

export default AuthMiddleware;
