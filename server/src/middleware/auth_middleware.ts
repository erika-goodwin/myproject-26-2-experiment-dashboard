import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  //   console.log("👉 authenticateJWT | headers:", req.headers.authorization);
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Missing Auth token" });
  }
  const token = authHeader.split(" ")[1];
  //   console.log("👉 authenticateJWT | token:", token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // console.log("👉 authenticateJWT | decoded:", decoded);
    req.user = decoded; // you can type this later
    next();
  } catch {
    res.status(403).json({ message: "Invalid token | auth" });
  }
}
