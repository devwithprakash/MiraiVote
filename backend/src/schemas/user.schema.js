import { z } from "zod";

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must have at least 2 characters")
    .max(40, "Name is too long"),

  email: z
    .string()
    .email("Invalid email")
    .transform((val) => val.trim().toLowerCase()),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(100, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&._-]{8,}$/,
      "Only letters and numbers allowed",
    ),
});

const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email")
    .transform((val) => val.trim().toLowerCase()),
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(100, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&._-]{8,}$/,
      "Only letters and numbers allowed",
    ),
});

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(100, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&._-]{8,}$/,
      "Only letters and numbers allowed",
    ),
});

export { registerSchema, loginSchema, resetPasswordSchema };
