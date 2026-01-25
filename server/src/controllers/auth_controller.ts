import type { Request, Response } from "express";
import { pool } from "../db/index.js";
import bcrypt from "bcrypt";
import jwt, { type SignOptions, StringValue } from "jsonwebtoken";
import { userSchema } from "../validators/user_schema.js";

// console.log("👉 auth/resister Controller");
export async function register(req: Request, res: Response) {
//   console.log("👉 register hit");

  const parsed = userSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Invalid Input", errors: parsed.error.format() });
  }
  //   console.log("👉 parsed body:", parsed);

  const { email, password } = parsed.data ?? {};

  const saltRounds = 10;
  const hasedPassword = await bcrypt.hash(password, saltRounds);

  //   console.log("👉 User:", email, password, hasedPassword);

  await pool.query("INSERT INTO users (email, password) values ($1, $2)", [
    email,
    hasedPassword,
  ]);

  res.status(201).json({ message: "User Created" });
}

export async function login(req: Request, res: Response) {
  //   console.log("👉 login Controller hit");
  //   res.json({ ok: true });

  const parsed = userSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Invalid Input", errors: parsed.error.format() });
  }

  const { email, password } = parsed.data;
  //   console.log("👉 User:", email, password);

  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  const userData = result.rows[0];
  //   console.log("👉 Data/result:", userData);
  // undefined || {
  //   id: 'fbce8960-0061-41d3-b034-049721533b1a',
  //   email: 'Roma.Weissnat@gmail.com',
  //   password: '$2b$10$T40bRy0u1xOggv01qQ24BOqI7mj4/dkjI10EW3BOCVysD3HEwaX9m',
  //   created_at: 2026-01-24T09:55:28.379Z
  // }

  if (!userData)
    return res
      .status(401)
      .json({ message: "Invalid credentials / Email not found" });

  const isValidated = await bcrypt.compare(password, userData.password);
  //   console.log(
  //     "👉 Password checker:",
  //     isValidated,
  //     "//",
  //     password,
  //     " VS ",
  //     userData.password,
  //   );

  if (!isValidated)
    return res
      .status(401)
      .json({ message: "Invalid credentials / Password is not matching." });

  //   console.log("👉 JWT:", process.env.JWT_SECRET_KEY);

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
