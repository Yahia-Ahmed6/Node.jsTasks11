import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { createDB } from "../db.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { validate } from "../middlewares/validation.middleware.js";

const authRouter = express.Router();

const db = createDB();

const JWT_SECRET = process.env.JWT_SECRET || "my-super-secret-key";

authRouter.post("/register",validate(registerSchema),async (req, res, next) => {
    try {
      const {
        username,
        email,
        password
      } = req.body;
      const users = await db.getAll("auth_users");
      const existingUser = users.find(
        (user) => user.email === email
      );
      if (existingUser) {
        return res.status(409).json({
          errors: {
            email: {
              errors: ["Email already exists"]
            }
          }
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = {
        email,
        username,
        passwordHash,
        is_verified: false
      };
      const createdUser = await db.create(
        "auth_users",
        newUser
      );
      return res.status(201).json({
        message: "Registered successfully",
        user: {
          id: createdUser.id,
          email: createdUser.email,
          username: createdUser.username
        }
      });
    } catch (error) {
      next(error);
    }
  }
);
authRouter.post("/login",validate(loginSchema),async (req, res, next) => {
    try {
      const {
        email,
        password
      } = req.body;
      const users = await db.getAll("auth_users");
      
      const user = users.find(
        (user) => user.email === email
      );
      if (!user) {
        return res.status(401).json({
          errors: {
            email: {
              errors: ["Invalid email or password"]
            }
          }
        });
      }

      const isPasswordCorrect = await bcrypt.compare(
        password,
        user.passwordHash
      );
      if (!isPasswordCorrect) {
        return res.status(401).json({
          errors: {
            password: {
              errors: ["Invalid email or password"]
            }
          }
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username
        },
        JWT_SECRET,
        {
          expiresIn: "1h"
        }
      );

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000
      });
      return res.json({
        message: "Login successful"
      });
    } catch (error) {
      next(error);
    }
  }
);

authRouter.post("/logout",(req, res) => {
    res.clearCookie("token");
    return res.json({
      message: "Logout successful"
    });
  }
);

export { authRouter };