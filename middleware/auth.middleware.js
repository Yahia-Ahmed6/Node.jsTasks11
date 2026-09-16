import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "my-super-secret-key";

export function authMiddleware(req, res, next) {
    const cookies = req.headers.cookie;
    if (!cookies) {
        return res.status(401).json({
            error: "Unauthorized",
        });
    }
    const tokenCookie = cookies
        .split(";")
        .find((cookie) => cookie.trim().startsWith("token="));
    if (!tokenCookie) {
        return res.status(401).json({
            error: "Unauthorized",
        });
    }
    const token = tokenCookie.split("=")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } 
    catch (error) {
        return res.status(401).json({
            error: "Invalid or expired token",
        });
    }
}