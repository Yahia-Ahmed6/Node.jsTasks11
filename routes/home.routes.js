import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const homeRouter = express.Router();

homeRouter.get("/home",authMiddleware,(req, res) => {
    res.json({
      message: "Welcome to home",
      user: req.user
    });
  }
);
