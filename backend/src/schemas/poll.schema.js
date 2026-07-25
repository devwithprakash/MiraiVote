import { z } from "zod";

const optionSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Option text is required")
    .max(100, "Option text cannot exceed 100 characters"),

  order: z.number().int().nonnegative().optional(),
});

const questionSchema = z.object({
  text: z
    .string()
    .trim()
    .min(3, "Question text must be at least 3 characters")
    .max(300, "Question text cannot exceed 300 characters"),

  order: z.number().int().nonnegative().optional(),

  options: z
    .array(optionSchema)
    .min(2, "At least 2 options are required")
    .max(10, "A question can have at most 10 options"),
});

export const createPollSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Poll text must be at least 3 characters")
    .max(200, "Poll title can't exceed 200 characters"),

  mode: z.enum(["auth", "anonymous"]),

  expireAt: z
    .string()
    .datetime("Invalid expiry date format")
    .refine((date) => new Date(date) > new Date(), {
      message: "Expiry date must be in the future",
    }),

  questions: z
    .array(questionSchema)
    .min(1, "At least 1 question is required")
    .max(20, "A poll can have at most 20 questions"),
});
