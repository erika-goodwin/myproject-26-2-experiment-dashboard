import type { Request, Response } from "express";
import { pool } from "../db/index.js";
import bcrypt from "bcrypt";
import jwt, { type SignOptions, StringValue } from "jsonwebtoken";
import { userSchema } from "../validators/user_schema.js";

export async function register(req: Request, res: Response) {
  const parsed = userSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Invalid Input", errors: parsed.error.format() });
  }

  const { email, password } = parsed.data ?? {};

  const saltRounds = 10;
  const hasedPassword = await bcrypt.hash(password, saltRounds);

  await pool.query("INSERT INTO users (email, password) values ($1, $2)", [
    email,
    hasedPassword,
  ]);

  res.status(201).json({ message: "User Created" });
}

export async function login(req: Request, res: Response) {
  const parsed = userSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Invalid Input", errors: parsed.error.format() });
  }

  const { email, password } = parsed.data;
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  const userData = result.rows[0];

  if (!userData)
    return res
      .status(401)
      .json({ message: "Invalid credentials / Email not found" });

  const isValidated = await bcrypt.compare(password, userData.password);

  if (!isValidated)
    return res
      .status(401)
      .json({ message: "Invalid credentials / Password is not matching." });

  const jwtSecret = process.env.JWT_SECRET_KEY;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET_KEY is not defined");
  }

  const signOption: SignOptions = {
    expiresIn: jwtExpiresIn as StringValue,
  };

  const token = jwt.sign(
    { userId: userData.id, email: userData.email },
    jwtSecret,
    signOption,
  );

  console.log("👉 authenticateJWT | taken:", { token });
  res.json({ token });
}
