import { Router } from "express";

export const authRouter = Router();

/**
 * @swagger /auth/login
 * POST /auth/login
 *
 * @description Authenticate a user with email and password.
 *
 * @body {string} email - User's email address
 * @body {string} password - User's password
 *
 * @success {200} { message: string }
 *   Returns a success message on successful login.
 *
 * @error {422} { errors: { [field]: { errors: string[] } } }
 *   Validation failed (missing or invalid fields).
 *   Example: { errors: { email: { errors: ["Required"] }, password: { errors: ["Required"] } } }
 *
 * @error {500} { error: string }
 *   Internal server error.
 *   Example: { error: "something went wrong" }
 */
authRouter.post("/login", (req, res) => {

  // TODO: implement actual authentication (bcrypt, JWT, etc.)
  res.json({ message: "login endpoint" });
});

/**
 * @swagger /auth/register
 * POST /auth/register
 *
 * @description Register a new user account.
 *
 * @body {string} username - Desired username
 * @body {string} email - User's email address
 * @body {string} password - User's password
 * @body {string} password_confirmation - Password confirmation (must match password)
 *
 * @success {201} { message: string }
 *   Returns a success message on successful registration.
 *
 * @error {422} { errors: { [field]: { errors: string[] } } }
 *   Validation failed (missing fields or passwords don't match).
 *   Example: { errors: { email: { errors: ["Required"] }, password_confirmation: { errors: ["Passwords do not match"] } } }
 *
 * @error {500} { error: string }
 *   Internal server error.
 *   Example: { error: "something went wrong" }
 */
authRouter.post("/register", (req, res) => {

  // TODO: implement actual registration (hash password, save user, etc.)
  res.status(201).json({ message: "register endpoint" });
});

/**
 * @swagger /auth/logout
 * POST /auth/logout
 *
 * @description Log out the current user (invalidate session/token).
 *
 * @success {200} { message: string }
 *   Returns a success message on successful logout.
 *
 * @error {500} { error: string }
 *   Internal server error.
 *   Example: { error: "something went wrong" }
 */
authRouter.post("/logout", (req, res) => {
  // TODO: implement actual logout (destroy session, invalidate token, etc.)
  res.json({ message: "logout endpoint" });
});
