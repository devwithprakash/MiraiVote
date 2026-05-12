import { z } from "zod";

const optionSchema = z.object({
  text: z.string().trim().min(1, "Option text is required"),

  order: z.number().optional(),
});

const questionSchema = z.object({
  text: z.string().trim().min(1, "Question text is required"),

  order: z.number().optional(),

  options: z.array(optionSchema).min(2, "At least 2 options are required"),
});

export const pollSchema = z.object({
  title: z.string().trim().min(2, "Poll text must be at least 2 characters"),

  mode: z.enum(["auth", "anonymous"], {
    errorMap: () => ({
      message: "Mode must be either auth or anonymous",
    }),
  }),


  expireAt: z
    .string()
    .datetime("Invalid expiry date format")
    .refine((date) => new Date(date) > new Date(), {
      message: "Expiry date must be in the future",
    }),

  questions: z.array(questionSchema).min(1, "At least 1 question is required"),
});
