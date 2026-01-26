import z from "zod";

export const userSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must have 8 characters or more.")
    .max(30, "Password is too long."),
});
