import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { createDB } from "../db.js";

export const authRouter = Router();

const db = createDB();

const JWT_SECRET = process.env.JWT_SECRET || "my-super-secret-key";

authRouter.post("/register", async (req, res, next) => {
  try {
    const {
      username,
      email,
      password,
      password_confirmation,
    } = req.body;
    // Validation
    const errors = {};
    if (!username) {
      errors.username = {
        errors: ["Username is required"],
      };
    }
    if (!email) {
      errors.email = {
        errors: ["Email is required"],
      };
    }
    if (!password) {
      errors.password = {
        errors: ["Password is required"],
      };
    }
    if (!password_confirmation) {
      errors.password_confirmation = {
        errors: ["Password confirmation is required"],
      };
    }
    if (
      password &&
      password_confirmation &&
      password !== password_confirmation
    ) {
      errors.password_confirmation = {
        errors: ["Passwords do not match"],
      };
    }
    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        errors,
      });
    }

    // Check if email already exists
    const users = await db.getAll("auth_users");

    const existingUser = users.find(
      (user) => user.email === email
    );

    if (existingUser) {
      return res.status(422).json({
        errors: {
          email: {
            errors: ["Email already exists"],
          },
        },
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    await db.create("auth_users", {
      username,
      email,
      passwordHash,
      is_verified: false,
    });
    res.status(201).json({
      message: "Registration successful",
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const errors = {};
    if (!email) {
      errors.email = {
        errors: ["Email is required"],
      };
    }
    if (!password) {
      errors.password = {
        errors: ["Password is required"],
      };
    }
    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        errors,
      });
    }
    const users = await db.getAll("auth_users");
    const user = users.find(
      (user) => user.email === email
    );
    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }
      const passwordMatch = await bcrypt.compare(
      password,
      user.passwordHash
    );
    if (!passwordMatch) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });
    res.json({
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
});
authRouter.post("/logout", (req, res, next) => {
  try {
    res.clearCookie("token");

    res.json({
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
});