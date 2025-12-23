import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userService from "../services/user.service";
import { CatchError, TryError } from "../util/error";

const ACCESS_TOKEN_EXPIRY = "5h";

export const signup = async (req: Request, res: Response) => {
  console.log(" [AUTH] Signup request received");
  try {
    const { email, password } = req.body;
    console.log(" [AUTH] Signup email:", email);

    if (!email || !password) {
      console.log(" [AUTH] Signup failed: Missing email or password");
      throw TryError("Email and password are required", 400);
    }

    console.log(" [AUTH] Checking if user exists...");
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      console.log(" [AUTH] Signup failed: User already exists");
      throw TryError("User already exists", 409);
    }

    console.log(" [AUTH] Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(" [AUTH] Creating new user...");
    await userService.createUser({
      email,
      password: hashedPassword,
    });

    console.log(" [AUTH] Signup successful for:", email);
    res.json({ message: "Signup success" });
  } catch (err) {
    console.log(" [AUTH] Signup error:", err);
    CatchError(err, res, "Signup failed");
  }
};

export const login = async (req: Request, res: Response) => {
  console.log(" [AUTH] Login request received");
  try {
    const { email, password } = req.body;
    console.log(" [AUTH] Login attempt for email:", email);

    console.log(" [AUTH] Fetching user from database...");
    const user = await userService.getUserByEmail(email);

    if (!user) {
      console.log(" [AUTH] Login failed: User not found");
      throw TryError("User not found", 404);
    }

    console.log(" [AUTH] Validating password...");
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log(" [AUTH] Login failed: Invalid credentials");
      throw TryError("Invalid credentials", 401);
    }

    console.log(" [AUTH] Generating JWT token...");
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.AUTH_SECRET!,
      { expiresIn: "10m" }
    );
    console.log(" [AUTH] JWT token generated for user ID:", user.id);

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    console.log(" [AUTH] Access token cookie set");

    console.log(" [AUTH] Login successful for:", email);
    res.json({ message: "Login success" });
  } catch (err) {
    console.log(" [AUTH] Login error:", err);
    CatchError(err, res, "Login failed");
  }
};

export const getSession = async (req: Request, res: Response) => {
  console.log(" [AUTH] Get session request received");
  try {
    const token = req.cookies.accessToken;
    console.log(" [AUTH] Access token present:", !!token);
    if (!token) {
      console.log(" [AUTH] Get session failed: No token");
      throw TryError("Invalid session", 401);
    }

    console.log(" [AUTH] Verifying JWT token...");
    const session = jwt.verify(token, process.env.AUTH_SECRET!);
    console.log(" [AUTH] Session verified:", session);
    res.json(session);
  } catch (err) {
    console.log(" [AUTH] Get session error:", err);
    CatchError(err, res, "Invalid session");
  }
};

export const logout = async (req: Request, res: Response) => {
  console.log(" [AUTH] Logout request received");
  try {
    res.clearCookie("accessToken");
    console.log(" [AUTH] Access token cookie cleared");
    res.json({ message: "Logout success" });
  } catch (err) {
    console.log(" [AUTH] Logout error:", err);
    CatchError(err, res, "Logout failed");
  }
};
