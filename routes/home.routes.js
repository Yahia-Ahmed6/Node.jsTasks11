import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const homeRouter = Router();

homeRouter.get("/home",authMiddleware,(req, res) => {
    res.json({
      message: `Welcome ${req.user.username} to the home page!`,
    });
  }
);